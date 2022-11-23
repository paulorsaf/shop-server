export type Payment = {
    card: PayByCreditCardResponse;
    error: any;
    receiptUrl: string;
    type: string;
}

export type PurchaseProduct = {
    id: string;
    amount: number;
    name: string;
    price: number;
    priceWithDiscount: number;
    productInternalId: string;
}

export type User = {
    email: string;
    id: string;
}

type PayByCreditCardResponse = {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
}