export type Payment = {
    card: PayByCreditCardResponse;
    cupom: string;
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
    stock: {
        id: string;
    },
    unit: string;
    weight: number;
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