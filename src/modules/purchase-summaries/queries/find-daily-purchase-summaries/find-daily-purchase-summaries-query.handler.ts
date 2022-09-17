import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PurchaseSummaryRepository } from "../../repositories/purchase-summary.repository";
import { FindDailyPurchaseSummariesQuery } from "./find-daily-purchase-summaries.query";

@QueryHandler(FindDailyPurchaseSummariesQuery)
export class FindDailyPurchaseSummariesQueryHandler implements IQueryHandler<FindDailyPurchaseSummariesQuery> {

    constructor(
        private purchaseSummaryRepository: PurchaseSummaryRepository
    ){}

    async execute(query: FindDailyPurchaseSummariesQuery) {
        return this.purchaseSummaryRepository.find({
            companyId: query.companyId,
            from: query.from,
            until: query.until
        })
    }

}