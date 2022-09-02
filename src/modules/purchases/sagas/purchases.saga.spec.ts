import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
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

  it('given product removed, then publish remove stock command', done => {
    const event = new PurchaseStatusUpdatedEvent(
      'anyCompanyId',
      'anyPurchaseId',
      'anyStatus',
      'anyUserId'
    );

    sagas.purchaseStatusUpdated(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SendEmailOnPurchaseStatusChangeCommand(
          event.companyId, event.purchaseId, event.status
        )
      );
      done();
    });
  });

});
