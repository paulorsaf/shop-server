import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { AddStockOptionCommand } from './add-stock-option.command';
import { AddStockOptionCommandHandler } from './add-stock-option-command.handler';
import { StockRepository } from '../../repositories/stock.repository';
import { StockOptionAddedEvent } from './events/stock-option-added.event';
import { Stock } from '../../entities/stock';
import { StockWithSameConfigurationException } from '../../exceptions/stock-with-same-configuration.exception';

describe('AddStockOptionCommandHandler', () => {

  let handler: AddStockOptionCommandHandler;
  let stockRepository: StockRepositoryMock;
  let eventBus: EventBusMock;

  const command = new AddStockOptionCommand(
    'anyCompanyId', 'anyProductId', {
      quantity: 10, color: "anyColor", size: 'anySize'
    }, 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    stockRepository = new StockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AddStockOptionCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        StockRepository
      ]
    })
    .overrideProvider(StockRepository).useValue(stockRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<AddStockOptionCommandHandler>(AddStockOptionCommandHandler);
  });

  describe('given product', () => {

    it('when stock configuration doesnt exist, then add stock', async () => {
      await handler.execute(command);
  
      expect(stockRepository._addedWith).toEqual(
        new Stock('anyCompanyId', 'anyProductId', undefined, undefined, 10, 'anyColor', 'anySize')
      );
    });

    it('when stock with same configuration already exists, then throw error', async () => {
      stockRepository._response = [{color: "anyColor", size: "anySize"}];
  
      await expect(handler.execute(command)).rejects.toThrowError(StockWithSameConfigurationException);
    });
  
    it('when added stock option, then publish stock option added event', async () => {
      stockRepository._response = [];

      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new StockOptionAddedEvent(
          'anyCompanyId', 'anyProductId', {
            id: 'anyStockId', quantity: 10, color: "anyColor", size: "anySize"
          }, 'anyUserId'
        )
      );
    });

  })

});

class StockRepositoryMock {
  _addedWith: any;
  _response: any;

  addStock(param: any) {
    this._addedWith = param;
    return "anyStockId";
  }
  findByProductAndCompany() {
    return this._response;
  }
}