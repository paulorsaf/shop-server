export class CreateBannerDetailCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly createdBy: string
    ){}
}