import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { StockCreatedEvent } from './stock-created.event';
import { StockCreatedEventHandler } from './stock-created-event.handler';
import { EventBusMock } from '../../../../../mocks/event-bus.mock';
import { EventRepositoryMock } from '../../../../../mocks/event-repository.mock';
import { EventRepository } from '../../../../../repositories/event.repository';

describe('StockCreatedEventHandler', () => {

  let handler: StockCreatedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        StockCreatedEventHandler
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

    handler = module.get<StockCreatedEventHandler>(StockCreatedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new StockCreatedEvent(
      "anyCompanyId", "anyProductId", {
        id: "anyId", stockOption: {id: "anyId", quantity: 10, color: "anyColor", size: "anySize"}
      }, "anyUserId"
    )

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
