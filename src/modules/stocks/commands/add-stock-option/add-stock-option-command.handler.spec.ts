import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { AddStockOptionCommand } from './add-stock-option.command';
import { AddStockOptionCommandHandler } from './add-stock-option-command.handler';
import { StockRepositoryMock } from '../../../../mocks/stock-repository.mock';
import { StockRepository } from '../../repositories/stock.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { StockOptionAddedEvent } from './events/stock-option-added.event';
import { StockWithSameConfigurationException } from 'shop-shared-server/dist/src/index';
import { Stock, StockOption } from '../../entities/stock';

describe('AddStockOptionCommandHandler', () => {

  let handler: AddStockOptionCommandHandler;
  let stockRepository: StockRepositoryMock;
  let eventBus: EventBusMock;

  const command = new AddStockOptionCommand(
    'anyCompanyId', 'anyProductId', {quantity: 10, color: "anyColor", size: 'anySize'}, 'anyUserId'
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

    jest.spyOn(crypto, 'randomUUID').mockReturnValue('anyId');
  });

  it('given stock for product not found, then throw not found', async () => {
    stockRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given stock for product found', () => {

    beforeEach(() => {
      stockRepository.response = new Stock('anyCompanyId', 'anyProductId', 'anyId', []);
    })

    it('then add stock option', async () => {
      await handler.execute(command);
  
      expect(stockRepository.addedWith).toEqual(new StockOption('anyId', 10, 'anyColor', 'anySize'));
    });

    it('when stock with same configuration already exists, then throw error', async () => {
      stockRepository.response = new Stock('anyCompanyId', 'anyProductId', 'anyId', [
        new StockOption('anyId', 2, 'anyColor', 'anySize')
      ]);
  
      expect(handler.execute(command)).rejects.toThrowError(StockWithSameConfigurationException);
    });
  
    it('when added stock option, then publish stock option added event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new StockOptionAddedEvent(
          'anyCompanyId', 'anyProductId', 'anyId', {
            id: 'anyId', quantity: 10, color: "anyColor", size: "anySize"
          }, 'anyUserId'
        )
      );
    });
  
    it('when doesnt belong to company, then throw unauthorized error', async () => {
      stockRepository.response.companyId = 'anyOtherCompanyId';
  
      await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
    });

  })

});
