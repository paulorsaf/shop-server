export class PurchaseProductQuantityEditedEvent {
    private readonly eventType = "PURCHASE_PRODUCT_QUANTITY_EDITED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly amount: number,
        public readonly userId: string
    ){}
}