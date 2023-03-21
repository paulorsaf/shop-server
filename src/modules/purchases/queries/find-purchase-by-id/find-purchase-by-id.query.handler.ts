import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindPurchaseByIdQuery } from "./find-purchase-by-id.query";

@QueryHandler(FindPurchaseByIdQuery)
export class FindPurchaseByIdQueryHandler implements IQueryHandler<FindPurchaseByIdQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindPurchaseByIdQuery) {
        const purchase = await this.purchaseRepository.findById(query.purchaseId);
        if (!purchase) {
            throw new NotFoundException();
        }

        return purchase;
    }

}