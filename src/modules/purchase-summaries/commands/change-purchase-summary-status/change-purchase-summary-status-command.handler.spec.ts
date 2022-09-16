import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PurchaseSummaryRepository } from '../../repositories/purchase-summary.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { ChangePurchaseSummaryStatusCommandHandler } from './change-purchase-summary-status-command.handler';
import { ChangePurchaseSummaryStatusCommand } from './change-purchase-summary-status.command';

describe('ChangePurchaseSummaryStatusCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: ChangePurchaseSummaryStatusCommandHandler;

  let command: ChangePurchaseSummaryStatusCommand;
  let purchaseRepository: PurchaseRepositoryMock;
  let purchaseSummaryRepository: PurchaseSummaryRepositoryMock;

  beforeEach(async () => {
    command = new ChangePurchaseSummaryStatusCommand(
      "anyCompanyId", "anyPurchaseId"
    );
    eventBus = new EventBusMock();
    purchaseRepository = new PurchaseRepositoryMock();
    purchaseSummaryRepository = new PurchaseSummaryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ChangePurchaseSummaryStatusCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository,
        PurchaseSummaryRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .overrideProvider(PurchaseSummaryRepository).useValue(purchaseSummaryRepository)
    .compile();

    handler = module.get<ChangePurchaseSummaryStatusCommandHandler>(ChangePurchaseSummaryStatusCommandHandler);
  });

  it('given purchase not found, then do not update purchase summary payment success', async () => {
    purchaseRepository._response = null;
  
    await handler.execute(command);

    expect(purchaseSummaryRepository._isUpdated).toBeFalsy();
  })

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {
        id: 1, createdAt: '2022-09-16T12:32:58', status: "anyStatus"
      };
      purchaseSummaryRepository._response = {id: 1};
    })

    it('then update purchase summary payment error', async () => {
      await handler.execute(command);
  
      expect(purchaseSummaryRepository._isUpdated).toBeTruthy();
    })

  })

});

class PurchaseRepositoryMock {
  _response;
  findByIdAndCompanyId() {
    return this._response;
  }
}
class PurchaseSummaryRepositoryMock {
  _isUpdated = false;
  _response;
  findByCompanyIdAndDate() {
    return this._response;
  }
  updateStatus() {
    this._isUpdated = true;
  }
}