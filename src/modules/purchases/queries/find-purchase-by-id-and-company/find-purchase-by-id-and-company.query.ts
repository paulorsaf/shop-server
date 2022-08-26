export class FindPurchaseByIdAndCompanyQuery {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}