import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DeleteCategoryCommandHandler } from './delete-category-command.handler';
import { DeleteCategoryCommand } from './delete-category.command';
import { CategoryDeletedEvent } from './events/category-deleted.event';

describe('DeleteCategoryCommandHandler', () => {

  let handler: DeleteCategoryCommandHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  const categoryId = "anyId";
  const companyId = "anyCompanyId";
  const name = "anyCategoryName";

  const command = new DeleteCategoryCommand(
    categoryId, "anyUserId", companyId
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

  it('given category not found, then return not found exception', async () => {
    categoryRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given category belongs to company', () => {

    const category = {
      id: categoryId, companyId, name
    }

    it('then delete category', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(categoryRepository.deletedWith).toEqual(categoryId);
    });
  
    it('when category deleted, then call category deleted event', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CategoryDeletedEvent(
          {id: categoryId, name},
          companyId,
          "anyUserId"
        )
      )
    });

  })

  it('given category doesnt belong to company, then return error', async () => {
    categoryRepository.response = { id: "anyOtherCategoryId" };

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

});
