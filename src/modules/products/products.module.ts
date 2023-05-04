import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CreateProductCommandHandler } from './commands/create-product/create-product-command.handler';
import { ProductsController } from './products.controller';
import { FindProductsByCompanyQueryHandler } from './queries/find-by-company/find-products-by-company-query.handler';
import { ProductRepository } from './repositories/product.repository';
import { FindProductByIdQueryHandler } from './queries/find-by-id/find-product-by-id-query.handler';
import { UpdateProductCommandHandler } from './commands/update-product/update-product-command.handler';
import { DeleteProductCommandHandler } from './commands/delete-product/delete-product-command.handler';
import { RemoveStockByProductCommandHandler } from '../stocks/commands/remove-stock-by-product/remove-stock-by-product-command.handler';
import { ProductSagas } from './sagas/products.saga';
import { StockRepository } from '../stocks/repositories/stock.repository';
import { ChangeProductVisibilityCommandHandler } from './commands/change-product-visibility/change-product-visibility.command.handler';

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
    StockRepository,

    ChangeProductVisibilityCommandHandler,
    CreateProductCommandHandler,
    UpdateProductCommandHandler,
    DeleteProductCommandHandler,
    
    FindProductsByCompanyQueryHandler,
    FindProductByIdQueryHandler,

    RemoveStockByProductCommandHandler,

    ProductSagas
  ]
})
export class ProductsModule {}
