import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindPurchasesByUserQuery } from "./find-purchases-by-company.query";

@QueryHandler(FindPurchasesByUserQuery)
export class FindPurchasesByUserQueryHandler implements IQueryHandler<FindPurchasesByUserQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindPurchasesByUserQuery) {
        return this.purchaseRepository.find({companyId: query.companyId});
    }

}