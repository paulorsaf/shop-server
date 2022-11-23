import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { SendPurchaseToSystemCommand } from './send-purchase-to-system.command';
import { SendPurchaseToSystemCommandHandler } from './send-purchase-to-system.command.handler';
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CompanySystemFactory } from './factories/company-system.factory';
import { PurchaseSentToSystemEvent } from '../../events/purchase-sent-to-system.event';
import { UserRepository } from './repositories/user.repository';

describe('SendPurchaseToSystemCommandHandler', () => {

  let handler: SendPurchaseToSystemCommandHandler;
  let eventBus: EventBusMock;

  let companySystemFactory: CompanySystemFactoryMock;
  let purchaseRepository: PurchaseRepositoryMock;
  let userRepository: UserRepositoryMock;

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
    userRepository = new UserRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SendPurchaseToSystemCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanySystemFactory,
        PurchaseRepository,
        UserRepository
      ]
    })
    .overrideProvider(CompanySystemFactory).useValue(companySystemFactory)
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .overrideProvider(UserRepository).useValue(userRepository)
    .compile();

    handler = module.get<SendPurchaseToSystemCommandHandler>(SendPurchaseToSystemCommandHandler);
  });

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {id: "anyPurchaseId", user: {id: "anyUserId"}};
    })

    describe('when user found', () => {

      beforeEach(() => {
        userRepository._response = {id: "anyUserId"};
      })
      
      it('then send purchase to system', async () => {
        await handler.execute(command);

        expect(companySystemFactory._hasSent).toBeTruthy();
      })
      
      it('then set purchase data as sent to system', async () => {
        await handler.execute(command);

        expect(purchaseRepository._isSentToSystem).toBeTruthy();
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

    describe('when error on send purchase to system', () => {

      beforeEach(() => {
        purchaseRepository._response = {id: "anyPurchaseId", user: {id: "anyUserId"}};
        userRepository._response = {id: "anyUserId"};
        
        companySystemFactory._response = new Promise((r, reject) => reject({error: "any error"}));
      })

      it('when error on send purchase to system, then throw internal server error exception', async () => {
        await expect(handler.execute(command)).rejects.toThrowError(InternalServerErrorException);
      })

      it('then do not publish purchase sent to system event', async () => {
        try {
          await handler.execute(command);
        } catch (e){}

        expect(eventBus.published).toBeUndefined();
      })

    })

    it('when user not found, then throw not found exception', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    })

  })

});

class CompanySystemFactoryMock {
  _hasSent = false;
  _response;
  createSystem() {
    return {
      send: () => {
        this._hasSent = true;
        return this._response;
      }
    }
  }
}
class PurchaseRepositoryMock {
  _isSentToSystem = false;
  _response;
  findByIdAndCompany() {
    return this._response;
  }
  setAsSentToSystem() {
    this._isSentToSystem = true;
  }
}
class UserRepositoryMock {
  _response;
  findById() {
    return this._response;
  }
}