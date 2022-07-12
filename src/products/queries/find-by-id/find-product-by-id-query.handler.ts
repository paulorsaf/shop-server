import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Product } from "../../entities/product";
import { ProductRepository } from "../../repositories/product.repository";
import { FindProductByIdQuery } from "./find-product-by-id.query";

@QueryHandler(FindProductByIdQuery)
export class FindProductByIdQueryHandler implements IQueryHandler<FindProductByIdQuery> {

    constructor(
        private productRepository: ProductRepository
    ){}

    async execute(query: FindProductByIdQuery): Promise<Product> {
        const product = await this.productRepository.findById(query.productId);
        if (!this.belongsToCompany(product, query.companyId)) {
            return null;
        }

        return product;
    }

    private belongsToCompany(product: Product, companyId) {
        if (!product) {
            return false;
        }
        if (product.companyId !== companyId) {
            return false;
        }
        return true;
    }

}