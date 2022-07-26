export class UpdateBannerDetailCommand {
    constructor(
        public readonly companyId: string,
        public readonly banner: Banner,
        public readonly updatedBy: string
    ){}
}

type Banner = {
    id: string;
    productId: string;
}