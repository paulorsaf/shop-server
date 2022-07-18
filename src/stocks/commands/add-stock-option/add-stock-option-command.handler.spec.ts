import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../mocks/event-bus.mock';
import { AddStockOptionCommand } from './add-stock-option.command';
import { AddStockOptionCommandHandler } from './add-stock-option-command.handler';
import { StockRepositoryMock } from '../../../mocks/stock-repository.mock';
import { StockRepository } from '../../repositories/stock.repository';
import { Stock, StockOption } from '../../entities/stock';
import { UnauthorizedException } from '@nestjs/common';
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

    stockRepository.response = {id: "anyProductId"};

    jest.spyOn(crypto, 'randomUUID').mockReturnValue('anyId');
  });

  it('given stock for product not found, then create stock', async () => {
    stockRepository.response = null;

    await handler.execute(command);

    const stock = new Stock(
      'anyCompanyId', 'anyProductId', 'anyId', [new StockOption('anyId', 10, 'anyColor', 'anySize')]
    );
    expect(stockRepository.createdWith).toEqual(stock);
  });

  it('given stock for product found, then throw unauthorized', async () => {
    stockRepository.response = new Stock('anyOtherCompanyId', 'anyProductId', 'anyId', []);

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

});
