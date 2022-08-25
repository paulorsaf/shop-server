import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindPurchasesByUserCompanyQuery } from "./find-purchases-by-user-company.query";

@QueryHandler(FindPurchasesByUserCompanyQuery)
export class FindPurchasesByUserCompanyQueryHandler implements IQueryHandler<FindPurchasesByUserCompanyQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindPurchasesByUserCompanyQuery) {
        const purchase = new Purchase({
            companyId: query.companyId,
            userId: query.userId
        });

        return this.purchaseRepository.find(purchase);
    }

}