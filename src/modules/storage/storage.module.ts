import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { StorageRepository } from './repositories/storage.repository';
import { DeleteFileCommandHandler } from './commands/delete-file/delete-file-command.handler';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    StorageRepository,

    DeleteFileCommandHandler
  ]
})
export class StorageModule {}
