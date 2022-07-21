import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { DeleteProductFolderCommand } from './delete-product-folder.command';
import { DeleteFolderCommandHandler } from './delete-product-folder-command.handler';
import { StorageRepositoryMock } from '../../../../mocks/storage-repository.mock';
import { StorageRepository } from '../../repositories/storage.repository';
import { ProductFolderDeletedEvent } from './events/product-folder-deleted.event';

describe('DeleteFolderCommandHandler', () => {

  let handler: DeleteFolderCommandHandler;
  let storageRepository: StorageRepositoryMock;
  let eventBus: EventBusMock;

  const command = new DeleteProductFolderCommand(
    'anyCompanyId', 'anyProductId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    storageRepository = new StorageRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteFolderCommandHandler
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

    handler = module.get<DeleteFolderCommandHandler>(DeleteFolderCommandHandler);
  });

  it('given folder details, then remove folder', async () => {
    await handler.execute(command);

    expect(storageRepository.deletedWith).toEqual({
      companyId: "anyCompanyId",
      productId: "anyProductId"
    });
  });

  it('given folder deleted, then publish folder deleted event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductFolderDeletedEvent(
        'anyCompanyId', 'anyProductId', 'anyUserId'
      )
    );
  });

});
