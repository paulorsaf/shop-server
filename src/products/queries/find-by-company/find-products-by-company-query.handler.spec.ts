import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryMock } from '../../../mocks/repository.mock';
import { Product } from '../../entities/product';
import { ProductRepository } from '../../repositories/product.repository';
import { FindProductsByCompanyQueryHandler } from './find-products-by-company-query.handler';
import { FindProductsByCompanyQuery } from './find-products-by-company.query';

describe('FindProductsByCompanyQueryHandler', () => {

  let handler: FindProductsByCompanyQueryHandler;
  let productRepository: RepositoryMock;

  const command = new FindProductsByCompanyQuery('anyCompanyId');

  beforeEach(async () => {
    productRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindProductsByCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .compile();

    handler = module.get<FindProductsByCompanyQueryHandler>(FindProductsByCompanyQueryHandler);
  });

  it('given execute handler, then find products by company', async () => {
    const products = [
      new Product(
        'anyId', 'anyName', 'anyCategoryId', 'anyCompanyId', 'anyUserId', 'createdAt', 'updatedAt'
      )
    ];

    productRepository.response = products;

    const response = await handler.execute(command);

    expect(response).toEqual(products);
  });

});
