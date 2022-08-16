import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { StockRepository } from "../../repositories/stock.repository";
import { FindStockByProductQuery } from "./find-stock-by-product.query";

@QueryHandler(FindStockByProductQuery)
export class FindStockByProductQueryHandler implements IQueryHandler<FindStockByProductQuery> {

    constructor(
        private stockRepository: StockRepository
    ){}

    async execute(query: FindStockByProductQuery) {
        const stocks = await this.stockRepository.findByProductAndCompany(
            query.productId, query.companyId
        );
        return stocks;
    }

}