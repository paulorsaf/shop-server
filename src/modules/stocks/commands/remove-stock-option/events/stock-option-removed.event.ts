export class StockOptionRemovedEvent {
    private readonly eventType = "PRODUCT_STOCK_DELETED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly userId: string
    ){}
}