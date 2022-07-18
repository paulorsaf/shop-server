import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Stock, StockOption } from "../../entities/stock";
import { StockRepository } from "../../repositories/stock.repository";
import { FindStockByProductQuery } from "./find-stock-by-product.query";

@QueryHandler(FindStockByProductQuery)
export class FindStockByProductQueryHandler implements IQueryHandler<FindStockByProductQuery> {

    constructor(
        private stockRepository: StockRepository
    ){}

    async execute(query: FindStockByProductQuery): Promise<StockOption[]> {
        const stock = await this.stockRepository.findByProduct(query.productId);
        if (!stock) {
            return [];
        }
        if (stock.companyId !== query.companyId) {
            return [];
        }
        return stock.stockOptions;
    }

}