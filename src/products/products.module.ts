import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CreateProductCommandHandler } from './commands/create-product/create-product-command.handler';
import { ProductCreatedEventHandler } from './commands/create-product/events/product-created-event.handler';
import { ProductsController } from './products.controller';
import { FindProductsByCompanyQueryHandler } from './queries/find-by-company/find-products-by-company-query.handler';
import { ProductRepository } from './repositories/product.repository';
import { EventRepository } from '../repositories/event.repository';

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
    
    FindProductsByCompanyQueryHandler,

    ProductCreatedEventHandler
  ]
})
export class ProductsModule {}
