import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../mocks/event-bus.mock';
import { Category, CategoryUser } from '../../entities/category';
import { CategoryRepositoryMock } from '../../../mocks/category-repository.mock';
import { CategoryRepository } from '../../repositories/category.repository';
import { FindByCompanyQueryHandler } from './find-by-company-query.handler';
import { FindByCompanyQuery } from './find-by-company.query';

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
      new Category('1', 'name1', new CategoryUser('1', 'name1', 'email1'), 'companyId1'),
      new Category('2', 'name2', new CategoryUser('2', 'name2', 'email2'), 'companyId2')
    ];
    categoryRepository.response = categories;

    const response = await handler.execute(command);

    expect(response).toEqual(categories);
  });

});
