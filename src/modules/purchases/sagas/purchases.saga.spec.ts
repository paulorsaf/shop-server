import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ChangePurchaseSummaryStatusCommand } from '../../purchase-summaries/commands/change-purchase-summary-status/change-purchase-summary-status.command';
import { SendEmailOnPurchaseStatusChangeCommand } from '../../email/commands/send-email-on-purchase-status-change/send-email-on-purchase-status-change.command';
import { PurchaseStatusUpdatedEvent } from '../events/purchase-status-updated.event';
import { PurchasesSagas } from './purchases.saga';

describe('PurchasesSagas', () => {

  let sagas: PurchasesSagas;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PurchasesSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<PurchasesSagas>(PurchasesSagas);
  });

  describe('given purchase status updated', () => {
    const event = new PurchaseStatusUpdatedEvent(
      'anyCompanyId',
      'anyPurchaseId',
      {
        reason: "anyReason",
        status: "anyStatus"
      },
      "anyUserId"
    );

    it('then publish send email command', done => {
      sagas.purchaseStatusUpdated(of(event)).subscribe(response => {
        expect(response).toEqual(
          new SendEmailOnPurchaseStatusChangeCommand(
            event.companyId, event.purchaseId, event.status
          )
        );
        done();
      });
    });

    it('then publish update purchase summary status command', done => {
      sagas.purchaseStatusUpdatePurchaseSummary(of(event)).subscribe(response => {
        expect(response).toEqual(
          new ChangePurchaseSummaryStatusCommand(
            event.companyId, event.purchaseId
          )
        );
        done();
      });
    });
  })

});
