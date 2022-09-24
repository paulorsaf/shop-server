export type Cupom = {
    readonly companyId: string;
    readonly cupom: string;
    readonly discount: number;
    readonly id?: string;
    readonly amountLeft?: number;
    readonly expireDate?: string;
}