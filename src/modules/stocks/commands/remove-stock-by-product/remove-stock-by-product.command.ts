export class RemoveStockByProductCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly removedBy: string
    ){}
}