import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Category, CategoryUser } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { FindCategoryByIdQueryHandler } from './find-category-by-id-query.handler';
import { FindCategoryByIdQuery } from './find-category-by-id.query';
import { NotFoundException } from '@nestjs/common';

describe('FindCategoryByIdQueryHandler', () => {

  let handler: FindCategoryByIdQueryHandler;
  let categoryRepository: CategoryRepositoryMock;

  const command = new FindCategoryByIdQuery('anyCompanyId', 'anyCategoryId');
  let category: Category;

  beforeEach(async () => {
    category = new Category(
      'anyId', 'anyName', 'anyCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime'
    );
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindCategoryByIdQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CategoryRepository
      ]
    })
    .overrideProvider(CategoryRepository).useValue(categoryRepository)
    .compile();

    handler = module.get<FindCategoryByIdQueryHandler>(FindCategoryByIdQueryHandler);
  });

  it('given execute handler, then find category by id', async () => {
    categoryRepository.response = category;

    const response = await handler.execute(command);

    expect(response).toEqual(category);
  });

  it('given found category by id, when category belongs to company, then return category', async () => {
    categoryRepository.response = category;

    const response = await handler.execute(command);

    expect(response).toEqual(category);
  });

  it('given found category by id, when category doesnt belong to company, then return not found error', async () => {
    const category = new Category(
      'anyId', 'anyName', 'anyOtherCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime'
    );
    categoryRepository.response = category;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

});
