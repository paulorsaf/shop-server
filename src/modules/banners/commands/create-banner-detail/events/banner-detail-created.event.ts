export class BannerDetailCreatedEvent {
    private readonly eventType = "BANNER_CREATED_EVENT";
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