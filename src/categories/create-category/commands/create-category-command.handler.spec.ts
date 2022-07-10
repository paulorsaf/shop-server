import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../mocks/event-bus.mock';
import { Category } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { CategoryCreatedEvent } from '../events/category-created.event';
import { CreateCategoryCommand } from './create-category.command';
import { CreateCategoryCommandHandler } from './create-category-command.handler';

describe('CreateCategoryHandler', () => {

  let handler: CreateCategoryCommandHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CreateCategoryCommandHandler
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

    handler = module.get<CreateCategoryCommandHandler>(CreateCategoryCommandHandler);
  });

  it('given execute handler, then save category', async () => {
    const command = new CreateCategoryCommand("anyName");

    await handler.execute(command);

    expect(categoryRepository.savedWith).toEqual(
      new Category(null, "anyName")
    )
  });

  it('given execute handler, then publish category created event', async () => {
    const command = new CreateCategoryCommand("anyName");

    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new CategoryCreatedEvent(
        '1', "anyName", new Date().toUTCString(), "user1"
      )
    )
  });

});
