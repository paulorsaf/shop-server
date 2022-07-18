export class StockOptionAddedEvent {
    private readonly eventType = "STOCK_OPTION_ADDED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly stock: StockOption,
        public readonly userId: string
    ){}
}

type StockOption = {
    id: string;
    quantity: number;
    color?: string;
    size?: string;
}