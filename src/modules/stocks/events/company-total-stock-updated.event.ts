export class CompanyTotalStockUpdatedEvent {
    private readonly eventType = "COMPANY_TOTAL_STOCK_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly userId: string
    ){}
}