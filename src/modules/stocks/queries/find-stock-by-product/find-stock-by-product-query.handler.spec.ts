import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { StockRepository } from '../../repositories/stock.repository';
import { FindStockByProductQueryHandler } from './find-stock-by-product-query.handler';
import { FindStockByProductQuery } from './find-stock-by-product.query';

describe('FindStockByProductQueryHandler', () => {

  let handler: FindStockByProductQueryHandler;
  let stockRepository: StockRepositoryMock;

  const command = new FindStockByProductQuery('anyCompanyId', 'anyProductId');

  beforeEach(async () => {
    stockRepository = new StockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindStockByProductQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        StockRepository
      ]
    })
    .overrideProvider(StockRepository).useValue(stockRepository)
    .compile();

    handler = module.get<FindStockByProductQueryHandler>(FindStockByProductQueryHandler);
  });

  it('given find stocks, then return stocks', async () => {
    let stocks = [{id: 1}, {id: 2}];
    stockRepository._response = stocks;

    const response = await handler.execute(command);

    expect(response).toEqual(stocks);
  });

});

class StockRepositoryMock {
  _response: any;
  findByProductAndCompany() {
    return this._response;
  }
}