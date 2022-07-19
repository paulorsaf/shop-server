export class StockCreatedEvent {
    private readonly eventType = "STOCK_CREATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stock: Stock,
        public readonly userId: string
    ){}
}

type Stock = {
    id: string;
    stockOption: StockOption;
}
type StockOption = {
    id: string;
    quantity: number;
    color?: string;
    size?: string;
}