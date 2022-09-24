export type CreateCupomDTO = {
    readonly cupom: string;
    readonly discount: number;
    readonly amountLeft?: number;
    readonly expireDate?: string;
}