import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { EventRepository } from '../../repositories/event.repository';
import { AddProductImageCommandHandler } from './commands/add-product-image/add-product-image-command.handler';
import { ProductImagesController } from './product-images.controller';
import { ProductImageRepository } from './repositories/product-image.repository';
import { ProductRepository } from './repositories/product.repository';
import { StorageRepository } from './repositories/storage.repository';

@Module({
  controllers: [
    ProductImagesController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    EventRepository,

    ProductRepository,
    ProductImageRepository,
    StorageRepository,

    AddProductImageCommandHandler
  ]
})
export class ProductImagesModule {}
