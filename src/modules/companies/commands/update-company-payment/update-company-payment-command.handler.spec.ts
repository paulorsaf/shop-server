import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateCompanyPaymentCommand } from './update-company-payment.command';
import { UpdateCompanyPaymentCommandHandler } from './update-company-payment-command.handler';
import { CompanyRepository } from '../../repositories/company.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { StorageRepository } from '../../repositories/storage.repository';
import { CompanyPaymentUpdatedEvent } from '../../events/company-payment-updated.event';

describe('UpdateCompanyPaymentCommandHandler', () => {

  let handler: UpdateCompanyPaymentCommandHandler;
  let eventBus: EventBusMock;

  const payment = {
    creditCard: {id: "anyCreditCard"} as any,
    money: true,
    pixKey: "anyPixKey"
  };
  const command = new UpdateCompanyPaymentCommand(
    'anyCompanyId', payment, {companyId: "anyCompanyId", id: "anyUserId"}
  );
  let companyRepository: CompanyRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    companyRepository = new CompanyRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateCompanyPaymentCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanyRepository,
        StorageRepository
      ]
    })
    .overrideProvider(CompanyRepository).useValue(companyRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateCompanyPaymentCommandHandler>(UpdateCompanyPaymentCommandHandler);
  });

  describe('given company found', () => {

    beforeEach(() => {
      companyRepository._response = {id: "anyCompanyId"};
    })

    it('then update payment', async () => {
      await handler.execute(command);
  
      expect(companyRepository._hasUpdated).toBeTruthy();
    });

    it('when payment updated, then publish company payment updated event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CompanyPaymentUpdatedEvent(
          "anyCompanyId",
          payment,
          "anyUserId"
        )
      );
    });

    it('when user doesnt belong to company, then throw not authorized error', async () => {
      companyRepository._response = {id: "anyOtherCompanyId"};
  
      await expect(handler.execute(command)).rejects.toThrowError(ForbiddenException);
    });

  })

  describe('given company not found', () => {

    it('then throw not found error', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    });

  })

});

class CompanyRepositoryMock {
  _hasUpdated = false;
  _response;
  findById() {
    return this._response;
  }
  updatePayment() {
    this._hasUpdated = true;
  }
}