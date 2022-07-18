import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventRepositoryMock } from '../../../../../mocks/event-repository.mock';
import { EventBusMock } from '../../../../../mocks/event-bus.mock';
import { CategoryUpdatedEventHandler } from './category-updated-event.handler';
import { CategoryUpdatedEvent } from './category-updated.event';
import { EventRepository } from '../../../../../repositories/event.repository';

describe('CategoryUpdatedEventHandler', () => {

  let handler: CategoryUpdatedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoryUpdatedEventHandler
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

    handler = module.get<CategoryUpdatedEventHandler>(CategoryUpdatedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new CategoryUpdatedEvent(
      {id: "anyId", name: "anyName"},
      "anyCompanyId",
      "anyUserId"
    );

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
