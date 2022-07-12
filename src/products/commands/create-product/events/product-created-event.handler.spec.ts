import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductCreatedEvent } from './product-created.event';
import { ProductCreatedEventHandler } from './product-created-event.handler';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { EventRepositoryMock } from '../../../../mocks/event-repository.mock';
import { EventRepository } from '../../../../repositories/event.repository';

describe('ProductCreatedEventHandler', () => {

  let handler: ProductCreatedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductCreatedEventHandler
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

    handler = module.get<ProductCreatedEventHandler>(ProductCreatedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new ProductCreatedEvent(
      {categoryId: "anyCategoryId", id: "anyId", name: "anyName", price: 10, priceWithDiscount: 8},
      "anyCompanyId",
      "anyUserId"
    )

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
