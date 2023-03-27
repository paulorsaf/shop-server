export class CompanyServiceTaxUpdatedEvent {
    private readonly eventType = "COMPANY_SERVICE_TAX_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly serviceTax: number,
        public readonly userId: string
    ){}
}