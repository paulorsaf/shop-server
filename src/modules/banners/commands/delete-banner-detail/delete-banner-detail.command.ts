export class DeleteBannerDetailCommand {
    constructor(
        public readonly companyId: string,
        public readonly bannerId: string,
        public readonly deletedBy: string
    ){}
}