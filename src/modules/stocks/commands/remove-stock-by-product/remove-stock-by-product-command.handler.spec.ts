import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { RemoveStockByProductCommand } from './remove-stock-by-product.command';
import { RemoveStockByProductCommandHandler } from './remove-stock-by-product-command.handler';
import { StockRepositoryMock } from '../../../../mocks/stock-repository.mock';
import { StockRepository } from '../../repositories/stock.repository';
import * as crypto from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { StockRemovedEvent } from './events/stock-removed.event';

describe('RemoveStockByProductCommandHandler', () => {

  let handler: RemoveStockByProductCommandHandler;
  let stockRepository: StockRepositoryMock;
  let eventBus: EventBusMock;

  const command = new RemoveStockByProductCommand(
    'anyCompanyId', 'anyProductId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    stockRepository = new StockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        RemoveStockByProductCommandHandler
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

    handler = module.get<RemoveStockByProductCommandHandler>(RemoveStockByProductCommandHandler);

    stockRepository.response = {id: "anyProductId"};

    jest.spyOn(crypto, 'randomUUID').mockReturnValue('anyId');
  });

  it('given product stock not found, then throw not found exception', async () => {
    stockRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given product stock found, when stock doesnt belong to company, then throw not found exception', async () => {
    stockRepository.response = {companyId: "anyOtherCompanyId"};

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given product stock found, when stock belongs to company, then remove stock', async () => {
    stockRepository.response = {companyId: "anyCompanyId", id: "anyStockId"};

    await handler.execute(command);

    expect(stockRepository.removedWith).toEqual("anyStockId");
  });

  it('given product stock removed, then publish stock removed event', async () => {
    stockRepository.response = {companyId: "anyCompanyId", id: "anyStockId"};

    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new StockRemovedEvent('anyCompanyId', 'anyProductId', 'anyStockId', 'anyUserId')
    );
  });

});
