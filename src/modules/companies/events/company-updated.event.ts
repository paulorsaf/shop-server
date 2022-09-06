export class CompanyUpdatedEvent {
    private readonly eventType = "COMPANY_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly company: Company,
        public readonly userId: string
    ){}
}

type Company = {
    name: string;
}