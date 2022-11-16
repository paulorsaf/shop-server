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
import { HttpModule } from '@nestjs/axios';
import { RiccoSaoLuisCompanyStockRepository } from './commands/update-stock-by-company/repositories/ricco-sao-luis-company-stock.repository';
import { CompanyStockFactory } from './commands/update-stock-by-company/factories/company-stock.factory';
import { UpdateStockByCompanyCommandHandler } from './commands/update-stock-by-company/update-stock-by-company-command.handler';
import { ProductStockRepository } from './commands/update-stock-by-company/repositories/product-stock.repository';
import { RiccoImperatrizCompanyStockRepository } from './commands/update-stock-by-company/repositories/ricco-imperatriz-company-stock.repository';
import { SoapModule } from 'nestjs-soap';
import { getEnvProperty } from 'src/utils/env.utils';

@Module({
  controllers: [
    StocksController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule,
    HttpModule,
    SoapModule.register(
      {
        clientName: 'RICCO_SAO_LUIS_STOCK',
        uri: getEnvProperty('_COMPANY_STOCK_RICCO_SAO_LUIS')
      }
    )
  ],
  providers: [
    CompanyStockFactory,
    ProductRepository,
    ProductStockRepository,
    RiccoImperatrizCompanyStockRepository,
    RiccoSaoLuisCompanyStockRepository,
    StockRepository,

    FindStockByProductQueryHandler,

    AddStockOptionCommandHandler,
    RemoveStockOptionCommandHandler,
    UpdateStockOptionCommandHandler,
    
    RemoveStockByProductCommandHandler,
    UpdateProductStockCommandHandler,

    UpdateStockByCompanyCommandHandler,

    StockOptionSagas
  ]
})
export class StocksModule {}
