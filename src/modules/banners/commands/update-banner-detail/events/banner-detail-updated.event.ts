export class BannerDetailUpdatedEvent {
    private readonly eventType = "BANNER_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly banner: Banner,
        public readonly userId: string
    ){}
}

type Banner = {
    id: string;
    productId: string;
}