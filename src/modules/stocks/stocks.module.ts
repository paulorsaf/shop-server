import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { EventRepository } from 'src/repositories/event.repository';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { AddStockOptionCommandHandler } from './commands/add-stock-option/add-stock-option-command.handler';
import { CreateStockOptionCommandHandler } from './commands/create-stock-option/create-stock-option-command.handler';
import { StockCreatedEventHandler } from './commands/create-stock-option/events/stock-created-event.handler';
import { FindStockByProductQueryHandler } from './queries/find-stock-by-product/find-stock-by-product-query.handler';
import { StockRepository } from './repositories/stock.repository';
import { StocksController } from './stocks.controller';

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

    FindStockByProductQueryHandler,

    CreateStockOptionCommandHandler,
    AddStockOptionCommandHandler,

    StockCreatedEventHandler
  ]
})
export class StocksModule {}
