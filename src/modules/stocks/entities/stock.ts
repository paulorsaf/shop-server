export class Stock {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly id: string,
        public readonly stockOptions: StockOption[],
        public readonly quantity?: number,
        public readonly color?: string,
        public readonly size?: string
    ){}
}

export class StockOption {
    constructor(
        public readonly id: string,
        public readonly quantity: number,
        public readonly color?: string,
        public readonly size?: string
    ){}
}