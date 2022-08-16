export class StockOptionAddedEvent {
    private readonly eventType = "STOCK_ADDED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stock: Stock,
        public readonly userId: string
    ){}
}

type Stock = {
    id: string;
    quantity: number;
    color?: string;
    size?: string;
}