export class EditPurchaseProductQuantityCommand {

    constructor(
        public readonly companyId: string,
        public readonly userId: string,
        public readonly purchaseId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly value: number
    ){}

}