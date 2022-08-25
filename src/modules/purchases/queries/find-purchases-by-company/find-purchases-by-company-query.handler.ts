import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindPurchasesByUserQuery } from "./find-purchases-by-company.query";

@QueryHandler(FindPurchasesByUserQuery)
export class FindPurchasesByUserQueryHandler implements IQueryHandler<FindPurchasesByUserQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindPurchasesByUserQuery) {
        const purchase = new Purchase({
            companyId: query.companyId
        });

        return this.purchaseRepository.find(purchase);
    }

}