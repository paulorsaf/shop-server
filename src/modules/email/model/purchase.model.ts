import { Company } from "./company.model";
import { PurchaseProduct } from "./purchase-product.model";

export class Purchase {

    readonly address: any;
    readonly company: Company;
    readonly payment: Payment;
    readonly price: Price;
    readonly products: PurchaseProduct[];
    readonly reason: string;
    readonly status: string;
    readonly user: User;

    readonly totalAmount: number;

    constructor(param: PurchaseParam) {
        this.address = param.address;
        this.company = param.company;
        this.payment = param.payment;
        this.price = param.price;
        this.products = param.products;
        this.reason = param.reason;
        this.status = param.status;
        this.user = param.user;

        this.totalAmount = this.calculateTotalAmount();
    }

    private calculateTotalAmount() {
        let total = 0;
        if (this.products) {
            this.products.forEach(p => total += p.amount);
        }
        return total;
    }

}

type PurchaseParam = {
    address: Address;
    company: Company;
    payment: Payment;
    price: Price;
    products: PurchaseProduct[];
    reason: string;
    status: string;
    user: User;
}

type User = {
    email: string;
}

type Address = {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}

type Payment = {
    card: PayByCreditCardResponse;
    error?: any;
    receiptUrl?: string;
    type: string;
}

type Price = {
    products: number;
    delivery: number;
    paymentFee: number;
    total: number;
    totalWithPaymentFee: number;
}

type PayByCreditCardResponse = {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
}