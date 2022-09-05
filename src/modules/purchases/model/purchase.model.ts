import { Payment, PurchaseProduct, User } from "./purchase.types";

export class Purchase {

    readonly address: any;
    readonly createdAt: string;
    readonly companyId: string;
    readonly id: string;
    readonly payment: Payment;
    readonly products: PurchaseProduct[];
    private status: string;
    readonly totalAmount: number;
    readonly totalPrice: number;
    readonly user: User;

    constructor(params: PurchaseParams){
        this.address = params.address;
        this.createdAt = params.createdAt;
        this.companyId = params.companyId;
        this.id = params.id;
        this.payment = params.payment;
        this.products = params.products;
        this.status = params.status;
        this.totalAmount = this.getTotalAmount();
        this.totalPrice = this.getTotalPrice();
        this.user = params.user;
    }

    getStatus() {
        return this.status;
    }

    updateStatus(status: string) {
        this.status = status;
    }

    private getTotalAmount() {
        let total = 0;
        this.products?.forEach(p => {
            total += p.amount;
        })
        return total;
    }

    private getTotalPrice() {
        let total = 0;
        this.products?.forEach(p => {
            const price = p.priceWithDiscount || p.price;
            total += price * p.amount;
        })
        return total;
    }

}

type PurchaseParams = {
    address?: any;
    companyId: string;
    createdAt?: string;
    id?: string;
    payment?: Payment;
    products?: PurchaseProduct[];
    status?: string;
    user?: User;
}