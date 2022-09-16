import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ChangePurchaseSummaryStatusCommandHandler } from './commands/change-purchase-summary-status/change-purchase-summary-status-command.handler';
import { PurchaseSummaryRepository } from './repositories/purchase-summary.repository';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    PurchaseRepository,
    PurchaseSummaryRepository,

    ChangePurchaseSummaryStatusCommandHandler
  ]
})
export class PurchaseSummaryModule {}
