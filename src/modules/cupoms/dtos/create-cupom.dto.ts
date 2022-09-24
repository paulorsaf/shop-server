export type CreateCupomDTO = {
    readonly cupom: string;
    readonly amountLeft?: number;
    readonly expireDate?: string;
}