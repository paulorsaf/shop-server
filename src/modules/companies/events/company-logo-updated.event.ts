export class CompanyLogoUpdatedEvent {
    private readonly eventType = "COMPANY_LOGO_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly image: Image,
        public readonly userId: string
    ){}
}

type Image = {
    fileName: string;
    imageUrl: string;
}