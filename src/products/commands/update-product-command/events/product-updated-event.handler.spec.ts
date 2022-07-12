import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductUpdatedEvent } from './product-updated.event';
import { ProductUpdatedEventHandler } from './product-updated-event.handler';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { EventRepositoryMock } from '../../../../mocks/event-repository.mock';
import { EventRepository } from '../../../../repositories/event.repository';

describe('ProductUpdatedEventHandler', () => {

  let handler: ProductUpdatedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductUpdatedEventHandler
      ],
      imports: [
        CqrsModule,
      ],
      providers: [
        EventRepository
      ]
    })
    .overrideProvider(EventRepository).useValue(eventRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<ProductUpdatedEventHandler>(ProductUpdatedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new ProductUpdatedEvent(
      {categoryId: "anyCategoryId", id: "anyId", name: "anyName", price: 10, priceWithDiscount: 8},
      "anyCompanyId",
      "anyUserId"
    )

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
