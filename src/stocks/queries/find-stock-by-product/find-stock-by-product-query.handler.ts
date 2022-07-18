import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Stock } from "../../entities/stock";
import { StockRepository } from "../../repositories/stock.repository";
import { FindStockByProductQuery } from "./find-stock-by-product.query";

@QueryHandler(FindStockByProductQuery)
export class FindStockByProductQueryHandler implements IQueryHandler<FindStockByProductQuery> {

    constructor(
        private stockRepository: StockRepository
    ){}

    async execute(query: FindStockByProductQuery): Promise<Stock> {
        const stock = await this.stockRepository.findByProduct(query.productId);
        if (!stock) {
            return null;
        }
        if (stock.companyId !== query.companyId) {
            return null;
        }
        return stock;
    }

}