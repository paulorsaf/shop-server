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
import { ProductImageAddedEventHandler } from '../product-images/commands/add-product-image/events/product-image-added-event.handler';
import { ProductStockUpdatedEventHandler } from './commands/update-product-stock/events/product-stock-updated-event.handler';

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
    ProductImageAddedEventHandler,
    ProductStockUpdatedEventHandler,

    StockOptionSagas
  ]
})
export class StocksModule {}
