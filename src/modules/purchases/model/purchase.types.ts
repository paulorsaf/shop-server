export type Payment = {
    error: any;
    receiptUrl: string;
    type: string;
}

export type PurchaseProduct = {
    amount: number;
    price: number;
    priceWithDiscount: number;
}

export type User = {
    email: string;
    id: string;
}