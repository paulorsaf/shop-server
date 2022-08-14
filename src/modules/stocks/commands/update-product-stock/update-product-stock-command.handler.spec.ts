import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductStockCommandHandler } from './update-product-stock-command.handler';
import { UpdateProductStockCommand } from './update-product-stock.command';
import { ProductRepository } from '../../repositories/product.repository';
import { NotFoundException } from '@nestjs/common';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ProductStockUpdatedEvent } from './events/product-stock-updated.event';
import { StockRepository } from '../../repositories/stock.repository';

describe('UpdateProductStockCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: UpdateProductStockCommandHandler;
  let productRepository: ProductRepositoryMock;
  let stockRepository: StockRepositoryMock;

  const command = new UpdateProductStockCommand(
    'anyCompanyId', 'anyProductId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    productRepository = new ProductRepositoryMock();
    stockRepository = new StockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateProductStockCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository,
        StockRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(StockRepository).useValue(stockRepository)
    .compile();

    handler = module.get<UpdateProductStockCommandHandler>(UpdateProductStockCommandHandler);
  });

  it('given product found, then update stock on product', async () => {
    productRepository.response = {companyId: 'anyCompanyId'};

    await handler.execute(command);

    expect(productRepository.updatedStockWith).toEqual({
      amount: 10, productId: "anyProductId"
    });
  });

  it('given product updated, then publish stock product updated', async () => {
    productRepository.response = {companyId: 'anyCompanyId'};

    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductStockUpdatedEvent(
        'anyCompanyId', 'anyProductId', 10, 'anyUserId'
      )
    );
  });

});

class ProductRepositoryMock {

  updatedStockWith: any;

  response: any;

  findById(params: any) {
      return this.response;
  }
  updateStockAmount(params: any) {
      this.updatedStockWith = params;
  }

}

class StockRepositoryMock {
  getTotalStockByProduct() {
    return 10;
  }
}