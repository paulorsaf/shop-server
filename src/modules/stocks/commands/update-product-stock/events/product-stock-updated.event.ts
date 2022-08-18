export class ProductStockUpdatedEvent {
    private readonly eventType = "PRODUCT_STOCK_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly totalStock: number,
        public readonly userId: string
    ){}

}