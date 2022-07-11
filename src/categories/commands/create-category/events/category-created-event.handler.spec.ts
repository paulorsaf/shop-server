import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryCreatedEvent } from './category-created.event';
import { CategoryCreatedEventHandler } from './category-created-event.handler';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CategoryRepository } from '../../../repositories/category.repository';
import { Category, CategoryUser } from '../../../entities/category';

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
      new Category('1', 'name', new CategoryUser('1', 'name', 'any@email.com'), "anyCompanyId"),
      'createdAt'
    );

    await handler.handle(event);

    expect(categoryRepository.addedEvent).toEqual(event);
  });

});
