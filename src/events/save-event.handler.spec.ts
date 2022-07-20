import { Test, TestingModule } from '@nestjs/testing';
import { SaveEventHandler } from './save-event-event.handler';
import { EventRepositoryMock } from './../mocks/event-repository.mock';
import { EventRepository } from './../repositories/event.repository';

describe('SaveEventHandler', () => {

  let handler: SaveEventHandler;
  let eventRepository: EventRepositoryMock;

  beforeEach(async () => {
    eventRepository = new EventRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SaveEventHandler
      ],
      providers: [
        EventRepository
      ]
    })
    .overrideProvider(EventRepository).useValue(eventRepository)
    .compile();

    handler = module.get<SaveEventHandler>(SaveEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = {eventId: "anyEventId"}

    await handler.handle(event);

    expect(eventRepository.addedEvent).toEqual(event);
  });

});
