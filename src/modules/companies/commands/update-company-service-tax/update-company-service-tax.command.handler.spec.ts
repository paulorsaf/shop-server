import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateCompanyServiceTaxCommand } from './update-company-service-tax.command';
import { UpdateCompanyServiceTaxCommandHandler } from './update-company-service-tax.command.handler';
import { CompanyRepository } from '../../repositories/company.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyServiceTaxUpdatedEvent } from '../../events/company-service-tax-updated.event';

describe('UpdateCompanyServiceTaxCommandHandler', () => {

  let handler: UpdateCompanyServiceTaxCommandHandler;
  let eventBus: EventBusMock;

  const companyId = "anyCompanyId";
  const serviceTax = 10;
  const userId = "anyUserId";
  
  const command = new UpdateCompanyServiceTaxCommand(
    companyId, 
    serviceTax,
    {
        companyId,
        id: userId
    }
  );
  let companyRepository: CompanyRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    companyRepository = new CompanyRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateCompanyServiceTaxCommandHandler
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

    handler = module.get<UpdateCompanyServiceTaxCommandHandler>(UpdateCompanyServiceTaxCommandHandler);
  });

  describe('given company found', () => {

    beforeEach(() => {
      companyRepository._response = {id: "anyCompanyId"};
    })

    it('then update service tax', async () => {
      await handler.execute(command);
  
      expect(companyRepository._hasUpdated).toBeTruthy();
    });

    it('when address updated, then publish company service tax updated event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CompanyServiceTaxUpdatedEvent(
          companyId,
          serviceTax,
          userId
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
  updateServiceTax(){
    this._hasUpdated = true;
  }
}