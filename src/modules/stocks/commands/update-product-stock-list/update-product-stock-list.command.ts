export class UpdateProductStockListCommand {

    constructor(
        public readonly companyId: string,
        public readonly products: UpdateProductList[],
        public readonly updatedBy: string
    ){}

}

type UpdateProductList = {
    productId: string;
    amount: number;
}