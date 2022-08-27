export class UpdatePurchaseStatusCommand {

    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly status: string,
        public readonly userId: string
    ){}

}