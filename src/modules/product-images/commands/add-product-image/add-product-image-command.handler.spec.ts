import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { AddProductImageCommandHandler } from './add-product-image-command.handler';
import { AddProductImageCommand } from './add-product-image.command';
import { ProductImageRepository } from '../../repositories/product-image.repository';
import { ProductImageRepositoryMock } from '../../../../mocks/product-image-repository.mock';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProductRepository } from '../../repositories/product.repository';
import { StorageRepository } from '../../repositories/storage.repository';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { StorageRepositoryMock } from '../../../../mocks/storage-repository.mock';
import * as crypto from 'crypto';
import { ProductImageAddedEvent } from './events/product-image-added.event';

describe('AddProductImageCommandHandler', () => {

  let handler: AddProductImageCommandHandler;
  let productImageRepository: ProductImageRepositoryMock;
  let productRepository: RepositoryMock;
  let storageRepository: StorageRepositoryMock;
  let eventBus: EventBusMock;

  const file = {filename: "anyOriginal.name.jpg"} as any;
  const command = new AddProductImageCommand(
    'anyCompanyId', 'anyProductId', file, 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    productImageRepository = new ProductImageRepositoryMock();
    productRepository = new RepositoryMock();
    storageRepository = new StorageRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AddProductImageCommandHandler
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

    handler = module.get<AddProductImageCommandHandler>(AddProductImageCommandHandler);

    jest.spyOn(crypto, 'randomUUID').mockReturnValue('anyImageId');
  });

  it('given product doesnt exist, then throw not found exception', async () => {
    productRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

  it('given product exists, when product doesnt belong to company then throw unauthorized exception', async () => {
    productRepository.response = {companyId: 'anyOtherCompanyId'};

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  })

  describe('given product exists and belongs to company', () => {

    beforeEach(async() => {
      storageRepository.response = "http://anyImageId.jpg";
      productRepository.response = {companyId: 'anyCompanyId'};
  
      await handler.execute(command);
    })

    it('then save image on storage', async () => {
      expect(storageRepository.savedWith).toEqual({
        companyId: command.companyId,
        filePath: command.image.path,
        productId: command.productId,
        name: "anyImageId.jpg"
      });
    })
  
    it('when image saved on storage, then save product image', async () => {
      expect(productImageRepository.addedWith).toEqual({
        productId: "anyProductId",
        imageUrl: "http://anyImageId.jpg",
        fileName: "anyImageId.jpg"
      });
    })
  
    it('when product image saved, then publish product image added event', async () => {
      expect(eventBus.published).toEqual(
        new ProductImageAddedEvent(
          'anyCompanyId', 'anyProductId', {
            imageUrl: "http://anyImageId.jpg", fileName: "anyImageId.jpg"
          }, 'anyUserId'
        )
      );
    })

  })

});
