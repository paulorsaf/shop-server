import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { FindByCompanyQueryHandler } from './find-category-by-company-query.handler';
import { FindByCompanyQuery } from './find-category-by-company.query';

describe('FindByCompanyQueryHandler', () => {

  let handler: FindByCompanyQueryHandler;
  let categoryRepository: CategoryRepositoryMock;

  const command = new FindByCompanyQuery('anyCompanyId');

  beforeEach(async () => {
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindByCompanyQueryHandler
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

    handler = module.get<FindByCompanyQueryHandler>(FindByCompanyQueryHandler);
  });

  it('given execute handler, then find categories by company', async () => {
    const categories = [
      new Category('anyId', 'anyName', 'anyCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime'),
      new Category('anyId2', 'anyName', 'anyCompanyId', 'anyUserId', 'anyDatetime', 'anyDatetime')
    ];
    categoryRepository.response = categories;

    const response = await handler.execute(command);

    expect(response).toEqual(categories);
  });

});
