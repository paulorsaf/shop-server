export class FindPurchasesByUserCompanyQuery {
    constructor(
        public readonly companyId: string,
        public readonly userId: string
    ){}
}