import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { AddStockOptionCommand } from './add-stock-option.command';
import { AddStockOptionCommandHandler } from './add-stock-option-command.handler';
import { StockRepositoryMock } from '../../../../mocks/stock-repository.mock';
import { StockRepository } from '../../repositories/stock.repository';
import { Stock, StockOption } from '../../entities/stock';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

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

  it('given stock for product found, then add stock option', async () => {
    stockRepository.response = new Stock('anyCompanyId', 'anyProductId', 'anyId', []);

    await handler.execute(command);

    expect(stockRepository.addedWith).toEqual(new StockOption('anyId', 10, 'anyColor', 'anySize'));
  });

  it('given stock for product found, when doesnt belong to company, then throw unauthorized error', async () => {
    stockRepository.response = new Stock('anyOtherCompanyId', 'anyProductId', 'anyId', []);

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

});
