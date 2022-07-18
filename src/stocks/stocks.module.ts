import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { AddStockOptionCommandHandler } from './commands/add-stock-option/add-stock-option-command.handler';
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
    StockRepository,

    FindStockByProductQueryHandler,

    AddStockOptionCommandHandler
  ]
})
export class StocksModule {}
