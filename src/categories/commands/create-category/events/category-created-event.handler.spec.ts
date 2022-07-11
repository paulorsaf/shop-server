import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryCreatedEvent } from './category-created.event';
import { CategoryCreatedEventHandler } from './category-created-event.handler';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CategoryRepository } from '../../../repositories/category.repository';
import { Category } from '../../../entities/category';

describe('CategoryCreatedEventHandler', () => {

  let handler: CategoryCreatedEventHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoryCreatedEventHandler
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

    handler = module.get<CategoryCreatedEventHandler>(CategoryCreatedEventHandler);
  });

  it('given execute handler, then add category-created event', async () => {
    const event = new CategoryCreatedEvent(
      {id: "anyId", name: "anyName"},
      "anyCompanyId",
      "anyUserId"
    )

    await handler.handle(event);

    expect(categoryRepository.addedEvent).toEqual(event);
  });

});
