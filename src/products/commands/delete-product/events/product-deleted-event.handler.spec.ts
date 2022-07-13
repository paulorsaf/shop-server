import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventRepository } from '../../../../repositories/event.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ProductDeletedEventHandler } from './product-deleted-event.handler';
import { ProductDeletedEvent } from './product-deleted.event';
import { EventRepositoryMock } from '../../../../mocks/event-repository.mock';

describe('ProductDeletedEventHandler', () => {

  let handler: ProductDeletedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductDeletedEventHandler
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

    handler = module.get<ProductDeletedEventHandler>(ProductDeletedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new ProductDeletedEvent(
      {id: "anyId"},
      "anyCompanyId",
      "anyUserId"
    );

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
