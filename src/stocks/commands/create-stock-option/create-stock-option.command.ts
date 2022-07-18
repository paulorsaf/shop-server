import { StockOptionDTO } from "../../dtos/stock-option-dto";

export class CreateStockOptionCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockOption: StockOptionDTO,
        public readonly createdBy: string
    ){}
}