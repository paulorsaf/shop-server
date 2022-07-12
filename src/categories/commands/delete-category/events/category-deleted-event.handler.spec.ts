import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventRepository } from '../../../../repositories/event.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CategoryDeletedEventHandler } from './category-deleted-event.handler';
import { CategoryDeletedEvent } from './category-deleted.event';
import { EventRepositoryMock } from '../../../../mocks/event-repository.mock';

describe('CategoryDeletedEventHandler', () => {

  let handler: CategoryDeletedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoryDeletedEventHandler
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

    handler = module.get<CategoryDeletedEventHandler>(CategoryDeletedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new CategoryDeletedEvent(
      {id: "anyId", name: "anyName"},
      "anyCompanyId",
      "anyUserId"
    );

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
