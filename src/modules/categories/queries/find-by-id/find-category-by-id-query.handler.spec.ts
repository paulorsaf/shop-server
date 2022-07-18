import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { FindCategoryByIdQueryHandler } from './find-category-by-id-query.handler';
import { FindCategoryByIdQuery } from './find-category-by-id.query';

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

  it('given execute handler, when category not found, then return null', async () => {
    categoryRepository.response = null;

    const response = await handler.execute(command);

    expect(response).toBeNull();
  });

  it('given found category by id, when category doesnt belong to company, then return null', async () => {
    const category = new Category(
      'anyId', 'anyName', 'anyOtherCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime'
    );
    categoryRepository.response = category;

    const response = await handler.execute(command);

    expect(response).toBeNull();
  });

});
