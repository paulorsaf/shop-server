import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductStockListCommandHandler } from './update-product-stock-list-command.handler';
import { UpdateProductStockListCommand } from './update-product-stock-list.command';
import { ProductRepository } from '../../repositories/product.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';

describe('UpdateProductStockListCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: UpdateProductStockListCommandHandler;

  beforeEach(async () => {
    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateProductStockListCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateProductStockListCommandHandler>(UpdateProductStockListCommandHandler);
  });

  it('given command has a product, then publish update product stock event', () => {
    const command = new UpdateProductStockListCommand(
      'anyCompanyId', [
        {amount: 10, productId: "productId1"}
      ], 'anyUserId'
    );

    handler.execute(command);

    expect(false).toBeTruthy();
  })

});