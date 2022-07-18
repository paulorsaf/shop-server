import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { Category } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { UpdateCategoryCommandHandler } from './update-category-command.handler';
import { UpdateCategoryCommand } from './update-category.command';
import { UnauthorizedException } from '@nestjs/common';
import { CategoryUpdatedEvent } from './events/category-updated.event';

describe('UpdateCategoryCommandHandler', () => {

  let handler: UpdateCategoryCommandHandler;
  let categoryRepository: CategoryRepositoryMock;
  let eventBus: EventBusMock;

  const command = new UpdateCategoryCommand(
    "anyId", "anyName", "anyUserId", "anyCompanyId"
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateCategoryCommandHandler
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

    handler = module.get<UpdateCategoryCommandHandler>(UpdateCategoryCommandHandler);
  });

  describe('given category belongs to company', () => {

    const category = new Category(
      'anyId', 'anyName', 'anyCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime'
    )

    it('given category belongs to company, then update category', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(categoryRepository.updatedWith).toEqual({
        id: "anyId", name: "anyName"
      })
    });
  
    it('when category updated, then call category updated event', async () => {
      categoryRepository.response = category;
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CategoryUpdatedEvent(
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
