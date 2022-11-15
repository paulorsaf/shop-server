export class PurchaseStatusChangeEmailSentEvent {

    private readonly eventType = "PURCHASE_STATUS_CHANGE_EMAIL_SENT_EVENT";

    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly status: Status
    ){}

}

type Status = {
    reason: string;
    status: string;
}