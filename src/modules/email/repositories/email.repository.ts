import { Injectable } from "@nestjs/common";
import { Purchase } from "../model/purchase.model";
import * as SendingBlue from "@sendinblue/client";

@Injectable()
export class EmailRepository {

    sendStatusChangeEmail(purchase: Purchase){
        const smtpEmail = this.createNewPurchaseEmailForClient(purchase);

        this.sendTransactionEmail(smtpEmail);
        
        return Promise.resolve({});
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

    private createNewPurchaseEmailForClient(purchase: Purchase) {
        const smtpEmail = new SendingBlue.SendSmtpEmail();
        smtpEmail.subject = this.getSubject(purchase);
        smtpEmail.sender = {
            email: purchase.company.email,
            name: purchase.company.name
        };
        smtpEmail.to = [{email: purchase.user.email}];
        smtpEmail.htmlContent = this.getNewPurchaseEmailForCompanyHtmlClientContent(purchase);
        return smtpEmail;
    }

    private getNewPurchaseEmailForCompanyHtmlClientContent(purchase: Purchase) {
        return `
            <p>
                ${this.getEmailTitle(purchase)}
                <br/>
                ${this.getPurchaseContent(purchase)}
            </p>
        `;
    }

    private getEmailTitle(purchase: Purchase) {
        if (purchase.status === "PAID") {
            return `
                Confirmamos o pagamento da sua compra.<br/>
                Em breve iniciaremos a separação dos seus produtos.
            `
        }
        if (purchase.status === "SORTING_OUT") {
            return `
                Estamos separando a sua compra.<br/>
                Em breve ela estará pronta para
                ${purchase.address ? "entrega." : "você buscar na loja."}
            `
        }
        if (purchase.status === "READY") {
            return `
                Sua compra está pronta.<br/>
                ${purchase.address ?
                    "Em breve você receberá os seus produtos." :
                    "Você já pode buscar os seus produtos na loja."
                }
            `
        }
        if (purchase.status === "DELIVERYING") {
            return "Sua compra está a caminho e em breve chegará até a sua casa.";
        }
        if (purchase.status === "CANCELLED") {
            return `
                Sua compra foi cancelada.<br/>
                ${purchase.reason ? "Motivo: " + purchase.reason : ""}
            `;
        }
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

    private getPurchaseContent(purchase: Purchase) {
        return `<fieldset>
                    <legend style="font-weigth:600">Detalhes da compra:</legend>
                    ${purchase.products.map(p => 
                        `<div style="padding-bottom:10px;">
                            <div>${p.amount}x ${p.name}</div>
                            <div>
                                R$ ${p.totalPrice.toFixed(2)}
                                (${p.amount}x R$ ${(p.priceWithDiscount || p.price).toFixed(2)})
                            </div>
                            ${p.stock ?
                                p.stock?.color ?
                                    `<div style="width:60px;height:30px;background:${p.stock.color};border-radius:10px;color:white;text-align:center;line-height:30px;">
                                        ${p.stock.size}
                                    </div>`
                                :
                                p.stock?.size ? `<div>Tamanho: ${p.stock.size}</div>` : ''
                            : ''}
                        </div>`
                    ).join('')}
                    <br/>
                    ${
                        purchase.price?.delivery ?
                        `
                        <div>
                            Taxa de entrega:
                            por R$ ${purchase.price.delivery.toFixed(2)}
                        </div>
                        `
                        : ""
                    }
                    ${
                        purchase.price?.paymentFee ?
                        `
                        <div>
                            Taxa do cartão de crédito:
                            por R$ ${purchase.price.paymentFee.toFixed(2)}
                        </div>
                        `
                        : ""
                    }
                    <b>
                        <div>
                            Total:
                            ${purchase.totalAmount} ${purchase.totalAmount === 1 ? "produto" : "produtos"}
                            por R$ ${purchase.price.totalWithPaymentFee.toFixed(2)}
                        </div>
                    </b>
                </fieldset>
                <br/>
                <fieldset>
                    <legend style="font-weigth:600">Endereço da entrega:</legend>
                    ${
                        purchase.address ?
                        `Rua: ${purchase.address.street}<br/>
                        Número: ${purchase.address.number}<br/>
                        Bairro: ${purchase.address.neighborhood}<br/>
                        CEP: ${purchase.address.zipCode}<br/>
                        Complemento: ${purchase.address.complement}<br/>
                        Cidade: ${purchase.address.city}<br/>
                        Estado: ${purchase.address.state}`
                        :
                        'Busca na loja'
                    }
                </fieldset>
                <br/>
                <fieldset>
                    <legend style="font-weigth:600">Dados do pagamento:</legend>
                    Tipo de pagamento: ${this.getPaymentDescription(purchase)}<br/>

                    ${
                        purchase.price ? 
                        `
                        <table style="border:none;border-spacing:0;margin:10px 0;">
                            <tr>
                                <td style="border:none">Produtos:</td>
                                <td style="border:none" align="right">R$ ${purchase.price?.products?.toFixed(2)}</td>
                            </tr>
                            ${
                                purchase.address ?
                                `
                                <tr>
                                    <td style="border:none">Taxa de entrega:</td>
                                    <td style="border:none" align="right">R$ ${purchase.price?.delivery?.toFixed(2)}</td>
                                </tr>
                                ` : ""
                            }
                            ${
                                purchase.payment.type === 'CREDIT_CARD' ?
                                `
                                <tr>
                                    <td style="border:none">Taxa do Cartão de crédito:</td>
                                    <td style="border:none" align="right">R$ ${purchase.price?.paymentFee?.toFixed(2)}</td>
                                </tr>
                                ` : ""
                            }
                            <tr>
                                <td style="border:none">Total:</td>
                                <td style="border:none" align="right">R$ ${purchase.price?.totalWithPaymentFee?.toFixed(2)}</td>
                            </tr>
                        </table>
                        ` : ""
                    }
                    ${purchase.payment.type === "CREDIT_CARD" && purchase.payment.card ?
                        `<div>Bandeira: ${purchase.payment.card.brand}</div>
                         <div>Número: **** **** **** ${purchase.payment.card.last4}</div>
                         <div>Expiração: ${purchase.payment.card.exp_month}/${purchase.payment.card.exp_year}</div>`
                        : ''
                    }
                    ${purchase.payment.receiptUrl ?
                        `<a href="${purchase.payment.receiptUrl}" target="_blank">Ver recibo</a><br/>`
                        : ''
                    }
                </fieldset>
        `;
    }

    private getPaymentDescription(purchase: Purchase) {
        if (purchase.payment.type === "MONEY") {
            return "Dinheiro";
        }
        if (purchase.payment.type === "CREDIT_CARD") {
            return "Cartão de crédito";
        }
        return purchase.payment.type;
    }

}