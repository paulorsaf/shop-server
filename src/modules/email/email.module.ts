import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { SendEmailOnPurchaseStatusChangeCommandHandler } from './commands/send-email-on-purchase-status-change/send-email-on-purchase-status-change-command.handler';
import { EmailRepository } from './repositories/email.repository';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    EmailRepository,
    PurchaseRepository,

    SendEmailOnPurchaseStatusChangeCommandHandler
  ]
})
export class EmailModule {}
