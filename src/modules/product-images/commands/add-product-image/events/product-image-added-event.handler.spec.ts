import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductImageAddedEvent } from './product-image-added.event';
import { ProductImageAddedEventHandler } from './product-image-added-event.handler';
import { EventBusMock } from '../../../../../mocks/event-bus.mock';
import { EventRepositoryMock } from '../../../../../mocks/event-repository.mock';
import { EventRepository } from '../../../../../repositories/event.repository';

describe('ProductImageAddedEventHandler', () => {

  let handler: ProductImageAddedEventHandler;
  let eventRepository: EventRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductImageAddedEventHandler
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

    handler = module.get<ProductImageAddedEventHandler>(ProductImageAddedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new ProductImageAddedEvent(
      "anyCompanyId", 'anyProductId', {fileName: "anyFileName", imageUrl: "anyImageUrl"}, "anyUserId"
    )

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
