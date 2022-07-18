import { AddStockOption } from "../../dtos/add-stock-option";

export class AddStockOptionCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockOption: AddStockOption,
        public readonly createdBy: string
    ){}
}