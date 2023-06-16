import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { CategoryCreatedEvent } from './events/category-created.event';
import { CreateCategoryCommand } from './create-category.command';
import { CreateCategoryCommandHandler } from './create-category-command.handler';

describe('CreateCategoryHandler', () => {

  let handler: CreateCategoryCommandHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  const categoryId = "anyCategoryId";
  const companyId = "anyCompanyId";
  const name = "anyName";
  const userId = "anyUserId";

  const command = new CreateCategoryCommand(
    name, companyId, userId
  );
  const category = {
    id: categoryId, name, companyId, createdBy: userId
  };

  beforeEach(async () => {
    eventBus = new EventBusMock();
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CreateCategoryCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CategoryRepository
      ]
    })
    .overrideProvider(CategoryRepository).useValue(categoryRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<CreateCategoryCommandHandler>(CreateCategoryCommandHandler);

    categoryRepository.response = category;
  });

  it('given execute handler, then save category', async () => {
    await handler.execute(command);

    expect(categoryRepository.savedWith).toEqual({
      companyId, name, createdBy: userId
    })
  });

  it('given execute handler, then publish category created event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new CategoryCreatedEvent(
        {id: categoryId, name},
        companyId,
        userId
      )
    )
  });

});
