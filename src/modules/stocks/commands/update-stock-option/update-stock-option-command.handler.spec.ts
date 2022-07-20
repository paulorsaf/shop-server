import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateStockOptionCommand } from './update-stock-option.command';
import { UpdateStockOptionCommandHandler } from './update-stock-option-command.handler';
import { StockRepositoryMock } from '../../../../mocks/stock-repository.mock';
import { StockRepository } from '../../repositories/stock.repository';
import { NotFoundException } from '@nestjs/common';
import { StockOptionUpdatedEvent } from './events/stock-option-updated.event';

describe('UpdateStockOptionCommandHandler', () => {

  let handler: UpdateStockOptionCommandHandler;
  let stockRepository: StockRepositoryMock;
  let eventBus: EventBusMock;

  const command = new UpdateStockOptionCommand(
    'anyCompanyId', 'anyProductId', 'anyStockId', 'anyStockOptionId', {
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
        StockRepository
      ]
    })
    .overrideProvider(StockRepository).useValue(stockRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateStockOptionCommandHandler>(UpdateStockOptionCommandHandler);
  });

  it('given product stock not found, then throw not found exception', async () => {
    stockRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given product stock found', () => {

    let stockOption: any;

    beforeEach(() => {
      stockOption = {
        id: "anyStockOptionId", amount: 5, color: 'anyOtherColor', size: 'anyOtherSize'
      };
      stockRepository.response = {
        id: "anyStockId", companyId: "anyCompanyId", stockOptions: [stockOption]
      };
    })

    it('when stock option not found, then throw not found exception', async () => {
      stockOption.id = "anyOtherStockOptionId";

      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    });
  
    it('when stock option found, then update stock option', async () => {
      await handler.execute(command);
  
      expect(stockRepository.updatedWith).toEqual({
        stockId: command.stockId, originalStockOption: stockOption, stockOption: {
          id: command.stockOptionId, ...command.stockOption
        }
      });
    });
  
    it('when stock option updated, then publish stock option updated event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new StockOptionUpdatedEvent(
          command.companyId, command.productId, command.stockId, stockOption, {
            id: command.stockOptionId,
            quantity: command.stockOption.quantity,
            color: command.stockOption.color,
            size: command.stockOption.size
          }, command.updatedBy
        )
      );
    });

  })

});
