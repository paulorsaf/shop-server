export class SendEmailOnPurchaseStatusChangeCommand {

    private readonly eventType = "SEND_EMAIL_ON_PURCHASE_STATUS_CHANGE_EVENT";

    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly purchaseStatus: string
    ){}

}