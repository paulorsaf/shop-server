import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SoapModule } from 'nestjs-soap';
import { getEnvProperty } from 'src/utils/env.utils';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { EditPurchaseProductQuantityCommandHandler } from './commands/edit-purchase-product/edit-purchase-product-quantity.command.handler';
import { CompanySystemFactory } from './commands/send-purchase-to-system/factories/company-system.factory';
import { RiccoImperatrizCompanySystemRepository } from './commands/send-purchase-to-system/repositories/ricco-imperatriz-company-system.repository';
import { RiccoSaoLuisCompanySystemRepository } from './commands/send-purchase-to-system/repositories/ricco-sao-luis-company-system.repository';
import { UserRepository } from './commands/send-purchase-to-system/repositories/user.repository';
import { SendPurchaseToSystemCommandHandler } from './commands/send-purchase-to-system/send-purchase-to-system.command.handler';
import { UpdatePurchaseStatusCommandHandler } from './commands/update-purchase-status/update-purchase-status-command.handler';
import { PurchasesController } from './purchases.controller';
import { FindPurchaseByIdAndCompanyQueryHandler } from './queries/find-purchase-by-id-and-company/find-purchase-by-id-and-company-query.handler';
import { FindPurchasesByUserQueryHandler } from './queries/find-purchases-by-company/find-purchases-by-company-query.handler';
import { PurchaseRepository } from './repositories/purchase.repository';
import { PurchasesSagas } from './sagas/purchases.saga';

@Module({
  controllers: [
    PurchasesController
  ],
  imports: [
    HttpModule,
    CqrsModule,
    AuthenticationModule,
    SoapModule.register(
      {
        clientName: 'RICCO_SAO_LUIS_STOCK',
        uri: getEnvProperty('COMPANY_STOCK_RICCO_SAO_LUIS')
      }
    )
  ],
  providers: [
    CompanySystemFactory,
    PurchaseRepository,
    RiccoImperatrizCompanySystemRepository,
    RiccoSaoLuisCompanySystemRepository,
    UserRepository,

    EditPurchaseProductQuantityCommandHandler,
    FindPurchasesByUserQueryHandler,
    FindPurchaseByIdAndCompanyQueryHandler,
    SendPurchaseToSystemCommandHandler,
    UpdatePurchaseStatusCommandHandler,

    PurchasesSagas
  ]
})
export class PurchasesModule {}
