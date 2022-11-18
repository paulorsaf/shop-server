export class SendPurchaseToSystemCommand {

    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly userId: string
    ){}

}