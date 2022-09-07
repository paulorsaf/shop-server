export class CompanyAboutUsUpdatedEvent {
    private readonly eventType = "COMPANY_ABOUT_US_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly html: string,
        public readonly userId: string
    ){}
}