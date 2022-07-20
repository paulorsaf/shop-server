export class StockRemovedEvent {
    private readonly eventType = "STOCK_REMOVED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly userId: string
    ){}
}