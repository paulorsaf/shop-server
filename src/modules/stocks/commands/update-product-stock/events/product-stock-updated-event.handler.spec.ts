import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductStockUpdatedEvent } from './product-stock-updated.event';
import { ProductStockUpdatedEventHandler } from './product-stock-updated-event.handler';
import { EventRepositoryMock } from '../../../../../mocks/event-repository.mock';
import { EventRepository } from '../../../../../repositories/event.repository';

describe('ProductStockUpdatedEventHandler', () => {

  let handler: ProductStockUpdatedEventHandler;
  let eventRepository: EventRepositoryMock;

  beforeEach(async () => {
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductStockUpdatedEventHandler
      ],
      imports: [
        CqrsModule,
      ],
      providers: [
        EventRepository
      ]
    })
    .overrideProvider(EventRepository).useValue(eventRepository)
    .compile();

    handler = module.get<ProductStockUpdatedEventHandler>(ProductStockUpdatedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new ProductStockUpdatedEvent(
      "anyCompanyId", "anyProductId", 10, "anyUserId"
    )

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
