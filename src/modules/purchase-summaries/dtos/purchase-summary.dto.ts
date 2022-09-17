export class PurchaseSummaryDTO {

    readonly createdAt: string;
    readonly address: any;
    readonly id: string;
    readonly payment: Payment;
    readonly price: number;
    readonly products: PurchaseSummaryProduct[];
    readonly status: string;
    readonly user: User;

    constructor(params: PurchaseSummaryParams) {
        this.id = params.id;
        this.address = params.address;
        this.createdAt = params.createdAt;
        this.payment = params.payment;
        this.price = params.price;
        this.products = params.products;
        this.status = params.status;
        this.user = params.user;
    }

}

type Payment = {
    error: string;
    receiptUrl: string;
    type: string;
}

type PurchaseSummaryProduct = {
    id: string;
    amount: number;
    name: string;
    price: number;
    priceWithDiscount: number;
}

type User = {
    email: string;
    id: string;
}

type PurchaseSummaryParams = {
    id: string;
    address: {latitude: number, longitude: number};
    createdAt: string;
    payment: Payment;
    price: number;
    products: PurchaseSummaryProduct[];
    status: string;
    user: User;
}