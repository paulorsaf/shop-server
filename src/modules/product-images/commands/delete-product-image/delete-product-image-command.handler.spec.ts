import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { DeleteProductImageCommandHandler } from './delete-product-image-command.handler';
import { DeleteProductImageCommand } from './delete-product-image.command';
import { ProductImageRepository } from '../../repositories/product-image.repository';
import { ProductImageRepositoryMock } from '../../../../mocks/product-image-repository.mock';
import { NotFoundException } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product.repository';
import { StorageRepository } from '../../repositories/storage.repository';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { StorageRepositoryMock } from '../../../../mocks/storage-repository.mock';
import { ProductImageDeletedEvent } from './events/product-image-deleted.event';

describe('DeleteProductImageCommandHandler', () => {

  let handler: DeleteProductImageCommandHandler;
  let productImageRepository: ProductImageRepositoryMock;
  let productRepository: RepositoryMock;
  let storageRepository: StorageRepositoryMock;
  let eventBus: EventBusMock;

  const command = new DeleteProductImageCommand(
    'anyCompanyId', 'anyProductId', "anyFileName", 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    productImageRepository = new ProductImageRepositoryMock();
    productRepository = new RepositoryMock();
    storageRepository = new StorageRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteProductImageCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductImageRepository,
        ProductRepository,
        StorageRepository
      ]
    })
    .overrideProvider(ProductImageRepository).useValue(productImageRepository)
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(StorageRepository).useValue(storageRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<DeleteProductImageCommandHandler>(DeleteProductImageCommandHandler);
  });

  it('given product doesnt exist, then throw not found exception', async () => {
    productRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

  describe('given product exists', () => {

    beforeEach(() => {
      productRepository.response = {companyId: "anyCompanyId", images: [{
        fileName: "anyFileName", imageUrl: "anyImageUrl"
      }]};
    })

    it('when product doesnt belong to company, then throw not found exception', async () => {
      productRepository.response.companyId = "anyOtherCompanyId";
  
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    })
  
    it('when image not found, then throw not found exception', async () => {
      productRepository.response.images[0].fileName = "anyOtherFileName";

      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    })
  
    it('when product belongs to company, then remove image', async () => {
      await handler.execute(command);
  
      expect(productImageRepository.deletedWith).toEqual({
        fileName: "anyFileName",
        imageUrl: "anyImageUrl",
        productId: "anyProductId"
      });
    })
  
    it('when product image removed, then publish product image removed event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new ProductImageDeletedEvent(
          'anyCompanyId', 'anyProductId', {
            fileName: 'anyFileName', imageUrl: 'anyImageUrl'
          }, 'anyUserId'
        )
      );
    })

  })

});
