export class PurchaseStatusChangeEmailSentEvent {

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