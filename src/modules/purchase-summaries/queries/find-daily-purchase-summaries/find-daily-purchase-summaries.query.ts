export class FindDailyPurchaseSummariesQuery {
    constructor(
        public readonly companyId: string,
        public readonly from: string,
        public readonly until: string
    ){}
}