export class UpdateStockOptionCommand {
    constructor(
        public readonly companyId: string,
        public readonly stockOptions: UpdateStockOptionList[],
        public readonly updatedBy: string
    ){}
}

type UpdateStockOptionList = {
    productId: string;
    stockId: string;
    stockOptionId: string;
    stockOption: StockOptionDTO
}

type StockOptionDTO = {
    quantity: number,
    color?: string,
    size?: string
}