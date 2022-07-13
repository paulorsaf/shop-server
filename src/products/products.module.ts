import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CreateProductCommandHandler } from './commands/create-product/create-product-command.handler';
import { ProductCreatedEventHandler } from './commands/create-product/events/product-created-event.handler';
import { ProductsController } from './products.controller';
import { FindProductsByCompanyQueryHandler } from './queries/find-by-company/find-products-by-company-query.handler';
import { ProductRepository } from './repositories/product.repository';
import { EventRepository } from '../repositories/event.repository';
import { FindProductByIdQueryHandler } from './queries/find-by-id/find-product-by-id-query.handler';
import { ProductUpdatedEventHandler } from './commands/update-product/events/product-updated-event.handler';
import { UpdateProductCommandHandler } from './commands/update-product/update-product-command.handler';
import { ProductDeletedEventHandler } from './commands/delete-product/events/product-deleted-event.handler';
import { DeleteProductCommandHandler } from './commands/delete-product/delete-product-command.handler';

@Module({
  controllers: [
    ProductsController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    ProductRepository,
    EventRepository,

    CreateProductCommandHandler,
    UpdateProductCommandHandler,
    DeleteProductCommandHandler,
    
    FindProductsByCompanyQueryHandler,
    FindProductByIdQueryHandler,

    ProductCreatedEventHandler,
    ProductUpdatedEventHandler,
    ProductDeletedEventHandler
  ]
})
export class ProductsModule {}
