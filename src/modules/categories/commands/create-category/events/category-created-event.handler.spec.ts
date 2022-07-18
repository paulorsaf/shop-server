import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryCreatedEvent } from './category-created.event';
import { CategoryCreatedEventHandler } from './category-created-event.handler';
import { EventBusMock } from '../../../../../mocks/event-bus.mock';
import { EventRepositoryMock } from '../../../../../mocks/event-repository.mock';
import { EventRepository } from '../../../../../repositories/event.repository';

describe('CategoryCreatedEventHandler', () => {

  let handler: CategoryCreatedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoryCreatedEventHandler
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

    handler = module.get<CategoryCreatedEventHandler>(CategoryCreatedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new CategoryCreatedEvent(
      {id: "anyId", name: "anyName"},
      "anyCompanyId",
      "anyUserId"
    )

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
