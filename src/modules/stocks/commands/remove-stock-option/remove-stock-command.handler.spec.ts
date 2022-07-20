import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { RemoveStockOptionCommand } from './remove-stock-option.command';
import { RemoveStockOptionCommandHandler } from './remove-stock-option-command.handler';
import { StockRepositoryMock } from '../../../../mocks/stock-repository.mock';
import { StockRepository } from '../../repositories/stock.repository';
import { NotFoundException } from '@nestjs/common';
import { StockOptionRemovedEvent } from './events/stock-option-removed.event';

describe('RemoveStockOptionCommandHandler', () => {

  let handler: RemoveStockOptionCommandHandler;
  let stockRepository: StockRepositoryMock;
  let eventBus: EventBusMock;

  const command = new RemoveStockOptionCommand(
    'anyCompanyId', 'anyProductId', 'anyStockId', 'anyStockOptionId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    stockRepository = new StockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        RemoveStockOptionCommandHandler
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

    handler = module.get<RemoveStockOptionCommandHandler>(RemoveStockOptionCommandHandler);
  });

  it('given stock not found, then return not found exception', async () => {
    stockRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given stock found', () => {

    let stockOption;

    beforeEach(() => {
      stockOption = {
        id: 'anyStockOptionId', quantity: -10, color: 'anyColor', size: 'anySize'
      };
      stockRepository.response = {
        companyId: "anyCompanyId", id: "anyStockId", stockOptions: [stockOption]
      };
    })

    it('when stock doesnt belong to company, then return not found exception', async () => {
      stockRepository.response.companyId = "anyOtherCompanyId";
  
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    });
  
    it('when stock option not found, then throw not found exception', async () => {
      stockOption.id = "anyOtherStockOptionId";

      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    });
  
    it('when stock option exists, then remove stock option', async () => {
      await handler.execute(command);
  
      expect(stockRepository.removedWith).toEqual({
        stockId: "anyStockId", stockOption
      });
    });
  
    it('when stock option removed, then publish stock removed event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new StockOptionRemovedEvent(
          'anyCompanyId', 'anyProductId', { stockId: "anyStockId", stockOption }, 'anyUserId'
        )
      );
    });

  })

});
