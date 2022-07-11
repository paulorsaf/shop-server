import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../mocks/event-bus.mock';
import { Category } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { UnauthorizedException } from '@nestjs/common';
import { DeleteCategoryCommandHandler } from './delete-category-command.handler';
import { DeleteCategoryCommand } from './delete-category.command';
import { CategoryDeletedEvent } from './events/category-deleted.event';

describe('DeleteCategoryCommandHandler', () => {

  let handler: DeleteCategoryCommandHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  const command = new DeleteCategoryCommand(
    "anyId", "anyUserId", "anyCompanyId"
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteCategoryCommandHandler
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

    handler = module.get<DeleteCategoryCommandHandler>(DeleteCategoryCommandHandler);
  });

  describe('given category belongs to company', () => {

    const category = new Category(
      'anyId', 'anyName', 'anyCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime'
    )

    it('then delete category', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(categoryRepository.deletedWith).toEqual("anyId");
    });
  
    it('when category deleted, then call category deleted event', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CategoryDeletedEvent(
          {id: "anyId", name: "anyName"},
          "anyCompanyId",
          "anyUserId"
        )
      )
    });

  })

  it('given category doesnt belong to company, then return error', async () => {
    const category = new Category(
      'anyId', 'anyName', 'anyOtherCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime'
    )
    categoryRepository.response = category;

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

});
