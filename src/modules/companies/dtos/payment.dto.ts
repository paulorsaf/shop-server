export type PaymentDTO = {
    creditCard: CreditCardPaymentDTO;
    isPaymentAfterPurchase: boolean;
    money: boolean;
    pixKey: string;
}

export type CreditCardPaymentDTO = {
    flags: string[]
    fee?: {
        percentage: number;
        value: number;
    }
}