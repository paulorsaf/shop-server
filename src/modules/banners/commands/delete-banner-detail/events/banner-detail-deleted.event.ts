export class BannerDetailDeletedEvent {
    private readonly eventType = "BANNER_DELETED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly bannerId: string,
        public readonly userId: string
    ){}
}