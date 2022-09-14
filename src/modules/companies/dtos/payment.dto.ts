export type PaymentDTO = {
    creditCard: CreditCardPaymentDTO;
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