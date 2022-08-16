import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateStockOptionCommand } from './update-stock-option.command';
import { UpdateStockOptionCommandHandler } from './update-stock-option-command.handler';
import { StockRepository } from '../../repositories/stock.repository';
import { NotFoundException } from '@nestjs/common';
import { StockOptionUpdatedEvent } from './events/stock-option-updated.event';
import { StockWithSameConfigurationException } from '../../exceptions/stock-with-same-configuration.exception';
import { ProductRepository } from '../../repositories/product.repository';
import { ProductRepositoryMock } from '../../../../mocks/product-repository.mock';

describe('UpdateStockOptionCommandHandler', () => {

  let handler: UpdateStockOptionCommandHandler;
  let stockRepository: StockRepositoryMock;
  let productRepository: ProductRepositoryMock
  let eventBus: EventBusMock;

  const command = new UpdateStockOptionCommand(
    'anyCompanyId', 'anyProductId', 'anyStockId', {
      quantity: 10, color: 'anyColor', size: 'anySize'
    }, 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    stockRepository = new StockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateStockOptionCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        StockRepository,
        ProductRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(StockRepository).useValue(stockRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateStockOptionCommandHandler>(UpdateStockOptionCommandHandler);
  });

  it('given stock not found, then throw not found exception', async () => {
    stockRepository._findByIdResponse = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given stock found', () => {

    beforeEach(() => {
      stockRepository._findByIdResponse = {id: "anyId", color: 'anyColor', size: 'anySize'};
      stockRepository._findByProductAndCompanyResponse = [];
    })

    it('when stock with same configuration already exists, then throw error', async () => {
      stockRepository._findByProductAndCompanyResponse = [{
        id: "anyOtherId", color: 'anyColor', size: 'anySize'
      }];
  
      expect(handler.execute(command)).rejects.toThrowError(StockWithSameConfigurationException);
    });
  
    it('then update stock option', async () => {
      await handler.execute(command);
  
      expect(stockRepository.updatedWith).toEqual({
        stockId: command.stockId, stock: {
          quantity: 10, color: 'anyColor', size: 'anySize'
        }
      });
    });
  
    it('when stock option updated, then publish stock option updated event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new StockOptionUpdatedEvent(
          command.companyId, command.productId, command.stockId, {
            quantity: command.stockOption.quantity,
            color: command.stockOption.color,
            size: command.stockOption.size
          }, command.updatedBy
        )
      );
    });

  })

});

class StockRepositoryMock {

  addedWith: any;
  addedWithId: string;
  createdWith: any;
  removedWith: any;
  searchedById: string = "";
  updatedWith: any;

  _findByProductAndCompanyResponse: any;
  _findByIdResponse: any;

  findById() {
    return this._findByIdResponse;
  }
  findByProductAndCompany(productId: string) {
    this.searchedById = productId;
    return this._findByProductAndCompanyResponse;
  }
  updateStockOption(params: any) {
    this.updatedWith = params;
  }

}