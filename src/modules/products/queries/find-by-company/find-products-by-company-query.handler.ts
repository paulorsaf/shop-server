import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Product } from "../../entities/product";
import { ProductRepository } from "../../repositories/product.repository";
import { FindProductsByCompanyQuery } from "./find-products-by-company.query";

@QueryHandler(FindProductsByCompanyQuery)
export class FindProductsByCompanyQueryHandler implements IQueryHandler<FindProductsByCompanyQuery> {

    constructor(
        private productRepository: ProductRepository
    ){}

    async execute(query: FindProductsByCompanyQuery): Promise<Product[]> {
        return this.productRepository.findByCompany({
            categoryId: query.categoryId,
            companyId: query.companyId,
            internalId: query.internalId,
            page: query.page
        });
    }

}