export class PurchaseStatusChangeEmailSentEvent {

    constructor(
        private readonly companyId: string,
        private readonly purchaseId: string,
        private readonly status: string
    ){}

}