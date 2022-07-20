import { StockOptionDTO } from "../../../stocks/dtos/stock-option-dto";

export class AddStockOptionCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockOption: StockOptionDTO,
        public readonly createdBy: string
    ){}
}