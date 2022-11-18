export class PurchaseSentToSystemEvent {
    private readonly eventType = "PURCHASE_SENT_TO_SYSTEM_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly userId: string
    ){}
}