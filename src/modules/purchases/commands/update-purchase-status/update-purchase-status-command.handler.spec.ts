import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdatePurchaseStatusCommand } from './update-purchase-status.command';
import { UpdatePurchaseStatusCommandHandler } from './update-purchase-status-command.handler';
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { PurchaseStatusUpdatedEvent } from '../../events/purchase-status-updated.event';
import { NotFoundException } from '@nestjs/common';

describe('UpdatePurchaseStatusCommandHandler', () => {

  let handler: UpdatePurchaseStatusCommandHandler;
  let eventBus: EventBusMock;
  let purchase: PurchaseMock;
  let purchaseRepository: PurchaseRepositoryMock;

  const command = new UpdatePurchaseStatusCommand(
    'anyCompanyId', 'anyPurchaseId', 'anyStatus', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    purchase = new PurchaseMock();
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdatePurchaseStatusCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<UpdatePurchaseStatusCommandHandler>(UpdatePurchaseStatusCommandHandler);
  });

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = purchase;
    })

    it('then update purchase status', async () => {
      await handler.execute(command);
  
      expect(purchase._isStatusUpdated).toBeTruthy();
    });

    it('when purchase status updated, then save updated status', async () => {
      await handler.execute(command);
  
      expect(purchaseRepository._isStatusUpdated).toBeTruthy();
    });

    it('when purchase updated, then publish purchase status updated event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new PurchaseStatusUpdatedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          "anyStatus",
          "anyUserId"
        )
      );
    });

  })

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

});

class PurchaseRepositoryMock {
  _isStatusUpdated = false;
  _response;

  findByIdAndCompany() {
    return this._response
  }
  updateStatus(){
    this._isStatusUpdated = true;
  }
}

class PurchaseMock {
  _isStatusUpdated = false;
  
  updateStatus() {
    this._isStatusUpdated = true;
  }
}