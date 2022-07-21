import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StorageRepository } from './repositories/storage.repository';
import { DeleteProductFileCommandHandler } from './commands/delete-product-file/delete-product-file-command.handler';
import { DeleteFolderCommandHandler } from './commands/delete-product-folder/delete-product-folder-command.handler';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    StorageRepository,

    DeleteProductFileCommandHandler,
    DeleteFolderCommandHandler
  ]
})
export class StorageModule {}
