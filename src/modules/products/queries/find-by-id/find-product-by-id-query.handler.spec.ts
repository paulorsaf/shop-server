import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Product } from '../../entities/product';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { ProductRepository } from '../../repositories/product.repository';
import { FindProductByIdQueryHandler } from './find-product-by-id-query.handler';
import { FindProductByIdQuery } from './find-product-by-id.query';

describe('FindProductByIdQueryHandler', () => {

  let handler: FindProductByIdQueryHandler;
  let productRepository: RepositoryMock;

  const command = new FindProductByIdQuery('anyCompanyId', 'anyCategoryId');
  let product: Product;

  beforeEach(async () => {
    product = new Product(
      'anyId', 'anyName', 'anyCategoryId', 10, 8, 'anyCompanyId', 'anyUserID', 'anyDate', 'anyDate'
    );
    productRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindProductByIdQueryHandler
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

    handler = module.get<FindProductByIdQueryHandler>(FindProductByIdQueryHandler);
  });

  it('given execute handler, then find product by id', async () => {
    productRepository.response = product;

    await handler.execute(command);

    expect(productRepository.searchedById).toBeTruthy();
  });

  it('given execute handler, when product not found, then return null', async () => {
    productRepository.response = null;

    const response = await handler.execute(command);

    expect(response).toBeNull();
  });

  it('given found product by id, when product belongs to company, then return product', async () => {
    productRepository.response = product;

    const response = await handler.execute(command);

    expect(response).toEqual(product);
  });

  it('given found product by id, when product doesnt belong to company, then return null', async () => {
    const product = new Product(
      'anyId', 'anyName', 'anyCategoryId', 10, 8, 'anyOtherCompanyId', 'anyUserID', 'anyDate', 'anyDate'
    );
    productRepository.response = product;

    await expect(handler.execute(command)).resolves.toBeNull();
  });

});
