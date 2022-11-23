import { User } from "./user.model";
import { Purchase } from './../../../model/purchase.model';
import { format } from "date-fns";

export class RiccoCompanySystem {
    id: string;
    tipoPagamento: string;
    totalVenda: number;
    clienteObj: RiccoCompanySystemClient;
    itemObj: RiccoCompanySystemItem[];

    constructor(purchase: Purchase, user: User) {
        this.clienteObj = {
            cpfCnpj: user.cpfCnpj,
            email: purchase.user.email,
            fone: user.phone,
            isCPF: user.cpfCnpj.length > 14 ? 'false' : 'true',
            nome: user.name
        };
        this.id = format(new Date(), 'yyyyMMddssSSSS');
        this.itemObj = purchase.products.map(p => ({
            id: parseInt(p.productInternalId),
            pUnitario: p.priceWithDiscount || p.price,
            qtde: p.amount,
            vTotal: (p.priceWithDiscount || p.price) * p.amount
        }));
        this.tipoPagamento = '1';
        this.totalVenda = purchase.price.totalWithPaymentFee;
    }
}
  
export type RiccoCompanySystemClient = {
    cpfCnpj: string;
    isCPF: string;
    nome: string;
    // endereco: string;
    // complemento: string;
    // cep: string;
    email: string;
    fone: string;
}
  
export type RiccoCompanySystemItem = {
    id: number;
    qtde: number;
    pUnitario: number;
    vTotal: number;
}