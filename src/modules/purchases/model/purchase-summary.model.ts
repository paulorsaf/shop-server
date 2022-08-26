import { Payment, PurchaseProduct, User } from "./purchase.types";

export class PurchaseSummary {

    readonly id: string;

    readonly createdAt: string;
    readonly companyId: string;
    readonly payment: Payment;
    #products: PurchaseProduct[];
    readonly status: string;
    readonly totalAmount: number;
    readonly totalPrice: number;
    readonly user: User;

    constructor(params: PurchaseParams){
        this.id = params.id;
        this.createdAt = params.createdAt;
        this.companyId = params.companyId;
        this.payment = params.payment;
        this.#products = params.products;
        this.status = params.status;
        this.totalAmount = this.getTotalAmount();
        this.totalPrice = this.getTotalPrice();
        this.user = params.user;
    }

    private getTotalAmount() {
        let total = 0;
        this.#products?.forEach(p => {
            total += p.amount;
        })
        return total;
    }

    private getTotalPrice() {
        let total = 0;
        this.#products?.forEach(p => {
            const price = p.priceWithDiscount || p.price;
            total += price * p.amount;
        })
        return total;
    }

}

type PurchaseParams = {
    id?: string;
    companyId: string;
    createdAt?: string;
    payment?: Payment;
    products?: PurchaseProduct[];
    status?: string;
    user?: User;
}