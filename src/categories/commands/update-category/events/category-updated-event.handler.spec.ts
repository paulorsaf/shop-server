import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CategoryRepository } from '../../../repositories/category.repository';
import { CategoryUpdatedEventHandler } from './category-updated-event.handler';
import { CategoryUpdatedEvent } from './category-updated.event';

describe('CategoryUpdatedEventHandler', () => {

  let handler: CategoryUpdatedEventHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoryUpdatedEventHandler
      ],
      imports: [
        CqrsModule,
      ],
      providers: [
        CategoryRepository
      ]
    })
    .overrideProvider(CategoryRepository).useValue(categoryRepository)
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

    expect(categoryRepository.addedEvent).toEqual(event);
  });

});
