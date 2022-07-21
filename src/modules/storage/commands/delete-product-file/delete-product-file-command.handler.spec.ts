import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { DeleteProductFileCommand } from './delete-product-file.command';
import { DeleteProductFileCommandHandler } from './delete-product-file-command.handler';
import { StorageRepositoryMock } from '../../../../mocks/storage-repository.mock';
import { StorageRepository } from '../../repositories/storage.repository';
import { ProductFileDeletedEvent } from './events/product-file-deleted.event';

describe('DeleteProductFileCommandHandler', () => {

  let handler: DeleteProductFileCommandHandler;
  let storageRepository: StorageRepositoryMock;
  let eventBus: EventBusMock;

  const command = new DeleteProductFileCommand(
    'anyCompanyId', 'anyProductId', 'anyFileName', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    storageRepository = new StorageRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteProductFileCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        StorageRepository
      ]
    })
    .overrideProvider(StorageRepository).useValue(storageRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<DeleteProductFileCommandHandler>(DeleteProductFileCommandHandler);
  });

  it('given image details, then remove image', async () => {
    await handler.execute(command);

    expect(storageRepository.deletedWith).toEqual({
      companyId: "anyCompanyId",
      productId: "anyProductId",
      fileName: "anyFileName"
    });
  });

  it('given image deleted, then publish image deleted event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductFileDeletedEvent(
        'anyCompanyId', 'anyProductId', 'anyFileName', 'anyUserId'
      )
    );
  });

});
