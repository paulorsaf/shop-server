import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { SendEmailOnPurchaseStatusChangeCommand } from './send-email-on-purchase-status-change.command';
import { SendEmailOnPurchaseStatusChangeCommandHandler } from './send-email-on-purchase-status-change-command.handler';
import { NotFoundException } from '@nestjs/common';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { EmailRepository } from '../../repositories/email.repository';
import { PurchaseStatusChangeEmailSentEvent } from '../../events/purchase-status-change-email-sent.event';
import { SendPurchaseStatusChangeEmailFailedEvent } from '../../events/send-purchase-status-change-email-failed.event';

describe('SendEmailOnPurchaseStatusChangeCommandHandler', () => {

  let handler: SendEmailOnPurchaseStatusChangeCommandHandler;
  let eventBus: EventBusMock;
  let emailRepository: EmailRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  const status = {status: "anyStatus", reason: "anyReason"};
  const command = new SendEmailOnPurchaseStatusChangeCommand(
    'anyCompanyId', 'anyPurchaseId', status
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    emailRepository = new EmailRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SendEmailOnPurchaseStatusChangeCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        EmailRepository,
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(EmailRepository).useValue(emailRepository)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<SendEmailOnPurchaseStatusChangeCommandHandler>(SendEmailOnPurchaseStatusChangeCommandHandler);
  });

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {id: 'anyPurchaseId', status: "PAID"};
      emailRepository._response = Promise.resolve();
    })

    it('when status is not valid, then do not send status change email to client', async () => {
      purchaseRepository._response = {id: 'anyPurchaseId', status: "ANY STATUS"};

      await handler.execute(command);

      expect(emailRepository._isSent).toBeFalsy();
    })

    it('when status is PAID, then send status change email to client', async () => {
      purchaseRepository._response = {id: 'anyPurchaseId', status: "PAID"};

      await handler.execute(command);

      expect(emailRepository._isSent).toBeTruthy();
    })

    it('when status is SORTING_OUT, then send status change email to client', async () => {
      purchaseRepository._response = {id: 'anyPurchaseId', status: "SORTING_OUT"};

      await handler.execute(command);

      expect(emailRepository._isSent).toBeTruthy();
    })

    it('when status is READY, then send status change email to client', async () => {
      purchaseRepository._response = {id: 'anyPurchaseId', status: "READY"};

      await handler.execute(command);

      expect(emailRepository._isSent).toBeTruthy();
    })

    it('when status is DELIVERYING, then send status change email to client', async () => {
      purchaseRepository._response = {id: 'anyPurchaseId', status: "DELIVERYING"};

      await handler.execute(command);

      expect(emailRepository._isSent).toBeTruthy();
    })

    it('when status is CANCELLED, then send status change email to client', async () => {
      purchaseRepository._response = {id: 'anyPurchaseId', status: "CANCELLED"};

      await handler.execute(command);

      expect(emailRepository._isSent).toBeTruthy();
    })

    it('when email sent, then publish purchase status change email sent event', async () => {
      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new PurchaseStatusChangeEmailSentEvent(
          "anyCompanyId",
          "anyPurchaseId",
          status
        )
      );
    })

    it('when error on send email, then publish purchase status change email failed event', async () => {
      const error = {error: "anyError"};
      emailRepository._response = Promise.reject(error);

      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new SendPurchaseStatusChangeEmailFailedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          status,
          error
        )
      );
    })

  })

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

});

class EmailRepositoryMock {
  _isSent = false;
  _response;

  sendStatusChangeEmail() {
    this._isSent = true;
    return this._response;
  }
}

class PurchaseRepositoryMock {
  _isStatusUpdated = false;
  _response;

  findByIdAndCompanyId() {
    return this._response
  }
}