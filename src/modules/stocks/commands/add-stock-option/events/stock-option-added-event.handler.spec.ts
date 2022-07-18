import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { StockOptionAddedEvent } from './stock-option-added.event';
import { StockOptionAddedEventHandler } from './store-option-added-event.handler';
import { EventBusMock } from '../../../../../mocks/event-bus.mock';
import { EventRepositoryMock } from '../../../../../mocks/event-repository.mock';
import { EventRepository } from '../../../../../repositories/event.repository';

describe('StockOptionAddedEventHandler', () => {

  let handler: StockOptionAddedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        StockOptionAddedEventHandler
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

    handler = module.get<StockOptionAddedEventHandler>(StockOptionAddedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new StockOptionAddedEvent(
      "anyCompanyId", "anyProductId", 'anyId', {
        id: "anyId", quantity: 10, color: "anyColor", size: "anySize"
      }, "anyUserId"
    )

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
