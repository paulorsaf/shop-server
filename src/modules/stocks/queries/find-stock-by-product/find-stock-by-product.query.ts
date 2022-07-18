export class FindStockByProductQuery {
    constructor(
        public readonly companyId: string,
        public readonly productId: string
    ) {}
}