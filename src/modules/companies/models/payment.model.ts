export type Payment = {
    creditCard: CreditCardPayment;
    money: boolean;
    pixKey: string;
}

export type CreditCardPayment = {
    flags: string[]
    fee?: {
        percentage: number;
        value: number;
    }
}