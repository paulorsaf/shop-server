import { StockOption } from "../../../entities/stock";

export class StockOptionRemovedEvent {
    private readonly eventType = "PRODUCT_STOCK_REMOVED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stock: Stock,
        public readonly userId: string
    ){}
}

type Stock = {
    stockId: string;
    stockOption: StockOption
}