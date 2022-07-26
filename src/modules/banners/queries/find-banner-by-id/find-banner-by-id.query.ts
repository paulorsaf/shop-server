export class FindBannerByIdQuery {
    constructor(
        public readonly companyId: string,
        public readonly bannerId: string
    ){}
}