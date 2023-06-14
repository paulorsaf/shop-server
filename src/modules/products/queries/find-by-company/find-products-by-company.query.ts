export class FindProductsByCompanyQuery {
    constructor(
        public readonly companyId: string,
        public readonly page: number,
        public readonly internalId: string,
        public readonly categoryId: string
    ){}
}