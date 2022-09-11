export type Payment = {
    card: PayByCreditCardResponse;
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

type PayByCreditCardResponse = {
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: string;
}