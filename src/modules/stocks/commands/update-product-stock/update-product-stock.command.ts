export class UpdateProductStockCommand {

    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly updatedBy: string
    ){}

}