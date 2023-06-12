import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateCompanyDeliveryPriceCommand } from './update-company-delivery-price.command';
import { UpdateCompanyDeliveryPriceCommandHandler } from './update-company-delivery-price.command.handler';
import { CompanyRepository } from '../../repositories/company.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyCityDeliveryPriceUpdatedEvent } from '../../events/company-city-delivery-price-updated.event';

describe('UpdateCompanyDeliveryPriceCommandHandler', () => {

  let handler: UpdateCompanyDeliveryPriceCommandHandler;
  let eventBus: EventBusMock;

  const command = new UpdateCompanyDeliveryPriceCommand(
    'anyCompanyId', 10, true, "anyUserId"
  );
  let companyRepository: CompanyRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    companyRepository = new CompanyRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateCompanyDeliveryPriceCommandHandler
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

    handler = module.get<UpdateCompanyDeliveryPriceCommandHandler>(UpdateCompanyDeliveryPriceCommandHandler);
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
        new CompanyCityDeliveryPriceUpdatedEvent(
          "anyCompanyId", 10, "anyUserId"
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
  updateCityDeliveryPrice(){
    this._hasUpdated = true;
  }
}