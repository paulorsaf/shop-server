export class PurchaseProductCancelledEvent {
    private readonly eventType = "PURCHASE_PRODUCT_CANCELLED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly userId: string
    ){}
}