import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Stock, StockOption } from '../../entities/stock';
import { StockRepositoryMock } from '../../../mocks/stock-repository.mock';
import { StockRepository } from '../../repositories/stock.repository';
import { FindStockByProductQueryHandler } from './find-stock-by-product-query.handler';
import { FindStockByProductQuery } from './find-stock-by-product.query';

describe('FindStockByProductQueryHandler', () => {

  let handler: FindStockByProductQueryHandler;
  let stockRepository: StockRepositoryMock;

  const command = new FindStockByProductQuery('anyCompanyId', 'anyProductId');
  const stock = new Stock(
    "anyCompanyId", "anyProductId", "anyId", [new StockOption("anyId", 10, "anyColor", "anySize")]
  );

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

  it('given execute handler, then find stock by product id', async () => {
    await handler.execute(command);

    expect(stockRepository.searchedById).toEqual('anyProductId');
  });

  it('given execute handler, when stocj not found, then return empty', async () => {
    stockRepository.response = null;

    const response = await handler.execute(command);

    expect(response).toBeNull();
  });

  it('given found stock, when stock belongs to company, then return stock', async () => {
    stockRepository.response = stock;

    const response = await handler.execute(command);

    expect(response).toEqual(stock);
  });

  it('given found stock, when stock doesnt belong to company, then return empty', async () => {
    stockRepository.response = new Stock(
      "anyOtherCompanyId", "anyProductId", 'anyId', [new StockOption("anyId", 10, "anyColor", "anySize")]
    );

    await expect(handler.execute(command)).resolves.toBeNull();
  });

});
