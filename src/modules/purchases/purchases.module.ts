import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { PurchasesController } from './purchases.controller';
import { FindPurchasesByUserCompanyQueryHandler } from './queries/find-purchases-by-user-company/find-purchases-by-user-company-query.handler';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  controllers: [
    PurchasesController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    PurchaseRepository,

    FindPurchasesByUserCompanyQueryHandler
  ]
})
export class PurchasesModule {}
