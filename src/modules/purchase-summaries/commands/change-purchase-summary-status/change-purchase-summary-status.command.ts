export class ChangePurchaseSummaryStatusCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}