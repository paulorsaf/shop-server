import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindPurchaseByIdAndCompanyQuery } from "./find-purchase-by-id-and-company.query";

@QueryHandler(FindPurchaseByIdAndCompanyQuery)
export class FindPurchaseByIdAndCompanyQueryHandler implements IQueryHandler<FindPurchaseByIdAndCompanyQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindPurchaseByIdAndCompanyQuery) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: query.companyId, id: query.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException();
        }

        return purchase;
    }

}