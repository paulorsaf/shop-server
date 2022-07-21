import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { DeleteFileCommand } from './delete-file.command';
import { DeleteFileCommandHandler } from './delete-file-command.handler';
import { StorageRepositoryMock } from '../../../../mocks/storage-repository.mock';
import { StorageRepository } from '../../repositories/storage.repository';
import { ImageFileDeletedEvent } from './events/image-file-deleted.event';

describe('DeleteFileCommandHandler', () => {

  let handler: DeleteFileCommandHandler;
  let storageRepository: StorageRepositoryMock;
  let eventBus: EventBusMock;

  const command = new DeleteFileCommand(
    'anyCompanyId', 'anyProductId', 'anyFileName', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    storageRepository = new StorageRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteFileCommandHandler
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

    handler = module.get<DeleteFileCommandHandler>(DeleteFileCommandHandler);
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
      new ImageFileDeletedEvent(
        'anyCompanyId', 'anyProductId', 'anyFileName', 'anyUserId'
      )
    );
  });

});
