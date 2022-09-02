export class SendPurchaseStatusChangeEmailFailedEvent {

    private readonly eventType = "SEND_PURCHASE_STATUS_CHANGE_EMAIL_FAILED_EVENT";

    constructor(
        private readonly companyId: string,
        private readonly purchaseId: string,
        private readonly status: string,
        private readonly error: any
    ){}

}