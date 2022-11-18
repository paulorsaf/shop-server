import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { SendPurchaseToSystemCommand } from './send-purchase-to-system.command';
import { SendPurchaseToSystemCommandHandler } from './send-purchase-to-system.command.handler';
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { NotFoundException } from '@nestjs/common';
import { CompanySystemFactory } from './factories/company-system.factory';
import { PurchaseSentToSystemEvent } from '../../events/purchase-sent-to-system.event';

describe('SendPurchaseToSystemCommandHandler', () => {

  let handler: SendPurchaseToSystemCommandHandler;
  let eventBus: EventBusMock;

  let companySystemFactory: CompanySystemFactoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  const companyId = "anyCompanyId";
  const purchaseId = "anyPurchaseId";
  const userId = "anyUserId";
  const command = new SendPurchaseToSystemCommand(
    companyId, purchaseId, userId
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();

    companySystemFactory = new CompanySystemFactoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SendPurchaseToSystemCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanySystemFactory,
        PurchaseRepository
      ]
    })
    .overrideProvider(CompanySystemFactory).useValue(companySystemFactory)
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<SendPurchaseToSystemCommandHandler>(SendPurchaseToSystemCommandHandler);
  });

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {id: "anyPurchaseId"};
    })

    it('then send purchase to system', async () => {
      await handler.execute(command);

      expect(companySystemFactory._hasSent).toBeTruthy();
    })

    it('then publish purchase sent to system event', async () => {
      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new PurchaseSentToSystemEvent(
          companyId, purchaseId, userId
        )
      );
    })

  })

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

});

class CompanySystemFactoryMock {
  _hasSent = false;
  createSystem() {
    return {
      send: () => {
        this._hasSent = true;
      }
    }
  }
}
class PurchaseRepositoryMock {
  _response;
  findByIdAndCompany() {
    return this._response;
  }
}