export class RemoveStockOptionCommand {

    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly stockOptionId: string,
        public readonly removedBy: string
    ){}

}