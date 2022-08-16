export class StockOptionUpdatedEvent {
    private readonly eventType = "STOCK_OPTION_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly stockId: string,
        public readonly stock: StockUpdate,
        public readonly userId: string
    ){}
}

type StockUpdate = {
    color: string;
    quantity: number;
    size: string;
}