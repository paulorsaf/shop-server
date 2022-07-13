import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../mocks/event-bus.mock';
import { RepositoryMock } from '../../../mocks/repository.mock';
import { ProductRepository } from '../../repositories/product.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { DeleteProductCommandHandler } from './delete-product-command.handler';
import { DeleteProductCommand } from './delete-product.command';
import { Product } from '../../entities/product';
import { ProductDeletedEvent } from './events/product-deleted.event';

describe('DeleteProductCommandHandler', () => {

  let handler: DeleteProductCommandHandler;
  let productRepository: RepositoryMock;
  let eventBus: EventBusMock;

  const command = new DeleteProductCommand(
    "anyId", "anyUserId", "anyCompanyId"
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    productRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteProductCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<DeleteProductCommandHandler>(DeleteProductCommandHandler);
  });

  it('given product not found, then return not found exception', async () => {
    productRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given product found and belongs to company', () => {

    const product = new Product(
      'anyId', 'anyName', 'anyCategoryId', 10, 8, 'anyCompanyId', 'anyUserId', 'anyDate', 'anyUserId', 'anyDate'
    )

    it('then delete product', async () => {
      productRepository.response = product;
  
      await handler.execute(command);
  
      expect(productRepository.deletedWith).toEqual("anyId");
    });
  
    it('when product deleted, then call product deleted event', async () => {
      productRepository.response = product;
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new ProductDeletedEvent(
          {id: "anyId"},
          "anyCompanyId",
          "anyUserId"
        )
      )
    });

  })


  it('given product found, when product doesnt belong to company, then return exception', async () => {
    const product = new Product(
      'anyId', 'anyName', 'anyCategoryId', 10, 8, 'anyOtherCompanyId', 'anyUserId', 'anyDate', 'anyUserId', 'anyDate'
    )
    productRepository.response = product;

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

});
