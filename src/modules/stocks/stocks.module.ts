import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { AddStockOptionCommandHandler } from './commands/add-stock-option/add-stock-option-command.handler';
import { StockOptionSagas } from './sagas/stock-option.saga';
import { FindStockByProductQueryHandler } from './queries/find-stock-by-product/find-stock-by-product-query.handler';
import { StockRepository } from './repositories/stock.repository';
import { StocksController } from './stocks.controller';
import { ProductRepository } from './repositories/product.repository';
import { RemoveStockOptionCommandHandler } from './commands/remove-stock-option/remove-stock-option-command.handler';
import { RemoveStockByProductCommandHandler } from './commands/remove-stock-by-product/remove-stock-by-product-command.handler';
import { UpdateStockOptionCommandHandler } from './commands/update-stock-option/update-stock-option-command.handler';
import { UpdateProductStockCommandHandler } from './commands/update-product-stock/update-product-stock-command.handler';

@Module({
  controllers: [
    StocksController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    StockRepository,
    ProductRepository,

    FindStockByProductQueryHandler,

    AddStockOptionCommandHandler,
    RemoveStockOptionCommandHandler,
    UpdateStockOptionCommandHandler,
    
    RemoveStockByProductCommandHandler,
    UpdateProductStockCommandHandler,

    StockOptionSagas
  ]
})
export class StocksModule {}
