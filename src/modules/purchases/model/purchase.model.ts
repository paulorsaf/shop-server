import { Payment, PurchaseProduct, User } from "./purchase.types";

export class Purchase {

    readonly address: any;
    readonly createdAt: string;
    readonly companyId: string;
    readonly hasBeenSentToSystem: boolean;
    readonly id: string;
    readonly payment: Payment;
    readonly price: Price;
    readonly productNotes: ProductNotes[];
    readonly products: PurchaseProduct[];
    readonly totalAmount: number;
    readonly totalPrice: number;
    readonly user: User;

    private status: string;

    constructor(params: PurchaseParams){
        this.address = params.address;
        this.createdAt = params.createdAt;
        this.companyId = params.companyId;
        this.hasBeenSentToSystem = params.hasBeenSentToSystem;
        this.id = params.id;
        this.payment = params.payment;
        this.price = params.price;
        this.productNotes = params.productNotes;
        this.products = params.products;
        this.status = params.status;
        this.totalAmount = this.getTotalAmount();
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

}

type PurchaseParams = {
    address?: any;
    companyId: string;
    createdAt?: string;
    hasBeenSentToSystem?: boolean;
    id?: string;
    payment?: Payment;
    price?: Price;
    productNotes?: ProductNotes[];
    products?: PurchaseProduct[];
    status?: string;
    user?: User;
}

type Price = {
    products: number;
    delivery: number;
    paymentFee: number;
    total: number;
    totalWithPaymentFee: number;
}

type ProductNotes = {
    notes: string;
    productId: string;
}