import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { PurchasesController } from './purchases.controller';
import { FindPurchasesByUserQueryHandler } from './queries/find-purchases-by-company/find-purchases-by-company-query.handler';
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

    FindPurchasesByUserQueryHandler
  ]
})
export class PurchasesModule {}
