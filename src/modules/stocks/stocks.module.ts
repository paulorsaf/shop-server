import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventRepository } from 'src/repositories/event.repository';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { AddStockOptionCommandHandler } from './commands/add-stock-option/add-stock-option-command.handler';
import { StockOptionAddedEventHandler } from './commands/add-stock-option/events/store-option-added-event.handler';
import { StockOptionSagas } from './sagas/stock-option.saga';
import { CreateStockOptionCommandHandler } from './commands/create-stock/create-stock-command.handler';
import { StockCreatedEventHandler } from './commands/create-stock/events/stock-created-event.handler';
import { FindStockByProductQueryHandler } from './queries/find-stock-by-product/find-stock-by-product-query.handler';
import { StockRepository } from './repositories/stock.repository';
import { StocksController } from './stocks.controller';
import { UpdateProductStockCommandHandler } from './commands/update-product-stock/update-product-stock-command.handler';
import { ProductRepository } from './repositories/product.repository';

@Module({
  controllers: [
    StocksController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    EventRepository,
    StockRepository,
    ProductRepository,

    FindStockByProductQueryHandler,

    CreateStockOptionCommandHandler,
    AddStockOptionCommandHandler,
    UpdateProductStockCommandHandler,

    StockCreatedEventHandler,
    StockOptionAddedEventHandler,

    StockOptionSagas
  ]
})
export class StocksModule {}
