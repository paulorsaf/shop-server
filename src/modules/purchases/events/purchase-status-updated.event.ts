export class PurchaseStatusUpdatedEvent {
    private readonly eventType = "PURCHASE_STATUS_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly status: Status,
        public readonly userId: string
    ){}
}

type Status = {
    reason: string;
    status: string;
}