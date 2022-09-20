import { Injectable } from "@nestjs/common";
import { Purchase } from "../model/purchase.model";
import * as SendingBlue from "@sendinblue/client";
import * as fs from 'fs';
import * as path from 'path';
import * as handlebars from 'handlebars';

@Injectable()
export class EmailRepository {

    async sendStatusChangeEmail(purchase: Purchase){
        const smtpEmail = await this.createNewPurchaseEmailForClient(purchase);

        this.sendTransactionEmail(smtpEmail);
        
        return Promise.resolve({});
    }

    private async createNewPurchaseEmailForClient(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = this.getSubject(purchase);
        smtpEmail.sender = {
            email: purchase.company.email,
            name: purchase.company.name
        };
        smtpEmail.to = [{email: purchase.user.email}];
        smtpEmail.htmlContent = await this.getStatusChangeEmailForClientHtmlClientContent(purchase);
        return smtpEmail;
    }

    private sendTransactionEmail(smtpEmail: SendingBlue.SendSmtpEmail){
        const apiKey = process.env.SENDINBLUE_API_KEY;
        if (apiKey) {
            const emailsApi = new SendingBlue.TransactionalEmailsApi();
            emailsApi.setApiKey(
                SendingBlue.TransactionalEmailsApiApiKeys.apiKey,
                apiKey
            );

            return emailsApi.sendTransacEmail(smtpEmail);
        }
    }

    async getStatusChangeEmailForClientHtmlClientContent(purchase: Purchase) {
        const mainContent = await this.getTemplateContent("status-change-email.template.html");

        return await this.createTemplate({
            mainContent,
            purchase
        });
    }

    private async getTemplateContent(template: string){
        const file = `${path.resolve(__dirname)}/templates/${template}`;
        return await fs.readFileSync(file, 'utf8');
    }

    private async createTemplate(data: any) {
        const {addressContent, paymentContent, purchasesContent } = await this.getPartials();

        const template = handlebars.compile(data.mainContent);
        handlebars.registerPartial('addressContent', addressContent);
        handlebars.registerPartial('paymentContent', paymentContent);
        handlebars.registerPartial('purchasesContent', purchasesContent);
        handlebars.registerHelper('ifEquals', (arg1, arg2, options) => {
            const response = {...this, purchase: data.purchase};
            return (arg1 == arg2) ? options.fn(response) : options.inverse(response);
        });
        handlebars.registerHelper('paymentType', (type) => {
            if (type === "MONEY") {
                return "Dinheiro";
            }
            if (type === "CREDIT_CARD") {
                return "Cartão de crédito";
            }
            return type;
        })
        handlebars.registerHelper('price', ({price, priceWithDiscount}) => (priceWithDiscount || price).toFixed(2))
        handlebars.registerHelper('toFixed', (value: number) => value.toFixed(2));
        
        return template({purchase: data.purchase});
    }

    private async getPartials() {
        const addressContent = await this.getTemplateContent("partials/address-content.template.html");
        const paymentContent = await this.getTemplateContent("partials/payment-content.template.html");
        const purchasesContent = await this.getTemplateContent("partials/purchases-content.template.html");

        return {addressContent, paymentContent, purchasesContent};
    }

    private getSubject(purchase: Purchase) {
        if (purchase.status === "PAID") {
            return "Pagamento confirmado";
        }
        if (purchase.status === "SORTING_OUT") {
            return "Estamos separando os produtos da sua compra";
        }
        if (purchase.status === "READY") {
            return "Sua compra está pronta";
        }
        if (purchase.status === "DELIVERYING") {
            return "Sua compra está a caminho";
        }
        if (purchase.status === "CANCELLED") {
            return "Sua compra foi cancelada";
        }
    }

}