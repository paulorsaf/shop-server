import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateCompanyAddressCommand } from './update-company-address.command';
import { UpdateCompanyAddressCommandHandler } from './update-company-address-command.handler';
import { CompanyRepository } from '../../repositories/company.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyAddressUpdatedEvent } from '../../events/company-address-updated.event';

describe('UpdateCompanyAddressCommandHandler', () => {

  let handler: UpdateCompanyAddressCommandHandler;
  let eventBus: EventBusMock;

  const address = {id: "anyAddress"} as any;
  const command = new UpdateCompanyAddressCommand(
    'anyCompanyId', address, {
      companyId: "anyCompanyId",
      id: "anyUserId"
    }
  );
  let companyRepository: CompanyRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    companyRepository = new CompanyRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateCompanyAddressCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanyRepository
      ]
    })
    .overrideProvider(CompanyRepository).useValue(companyRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateCompanyAddressCommandHandler>(UpdateCompanyAddressCommandHandler);
  });

  describe('given company found', () => {

    beforeEach(() => {
      companyRepository._response = {id: "anyCompanyId"};
    })

    it('then update address', async () => {
      await handler.execute(command);
  
      expect(companyRepository._hasUpdated).toBeTruthy();
    });

    it('when address updated, then publish company address updated event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CompanyAddressUpdatedEvent(
          "anyCompanyId",
          address,
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
  updateAddress(){
    this._hasUpdated = true;
  }
}