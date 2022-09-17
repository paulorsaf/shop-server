import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { ChangePurchaseSummaryStatusCommandHandler } from './commands/change-purchase-summary-status/change-purchase-summary-status-command.handler';
import { PurchaseSummaryController } from './purchase-summary.controller';
import { FindDailyPurchaseSummariesQueryHandler } from './queries/find-daily-purchase-summaries/find-daily-purchase-summaries-query.handler';
import { PurchaseSummaryRepository } from './repositories/purchase-summary.repository';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  controllers: [
    PurchaseSummaryController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    PurchaseRepository,
    PurchaseSummaryRepository,

    FindDailyPurchaseSummariesQueryHandler,

    ChangePurchaseSummaryStatusCommandHandler
  ]
})
export class PurchaseSummaryModule {}
