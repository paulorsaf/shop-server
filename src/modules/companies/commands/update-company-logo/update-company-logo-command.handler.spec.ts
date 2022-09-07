import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateCompanyLogoCommand } from './update-company-logo.command';
import { UpdateCompanyLogoCommandHandler } from './update-company-logo-command.handler';
import { CompanyRepository } from '../../repositories/company.repository';
import { ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CompanyLogoUpdatedEvent } from '../../events/company-logo-updated.event';
import { StorageRepository } from '../../repositories/storage.repository';

describe('UpdateCompanyLogoCommandHandler', () => {

  let handler: UpdateCompanyLogoCommandHandler;
  let eventBus: EventBusMock;

  const command = new UpdateCompanyLogoCommand(
    'anyCompanyId', "anyFilePath", {
      companyId: "anyCompanyId",
      id: "anyUserId"
    }
  );
  let companyRepository: CompanyRepositoryMock;
  let storageRepository: StorageRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    companyRepository = new CompanyRepositoryMock();
    storageRepository = new StorageRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateCompanyLogoCommandHandler
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
    .overrideProvider(StorageRepository).useValue(storageRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateCompanyLogoCommandHandler>(UpdateCompanyLogoCommandHandler);
  });

  describe('given company found', () => {

    const image = {
      fileName: "anyFileName",
      imageUrl: "anyImageUrl"
    };

    beforeEach(() => {
      companyRepository._response = {id: "anyCompanyId"};
      storageRepository._response = image;
    })

    it('then update logo', async () => {
      await handler.execute(command);
  
      expect(companyRepository._hasUpdated).toBeTruthy();
    });

    it('when error on save image on storage, then throw internal server error exception', async () => {
      storageRepository._response = Promise.reject({})
      
      await expect(handler.execute(command)).rejects.toThrowError(InternalServerErrorException);
    });

    it('when logo updated, then publish company logo updated event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new CompanyLogoUpdatedEvent(
          "anyCompanyId",
          image,
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
  updateLogo() {
    this._hasUpdated = true;
  }
}
class StorageRepositoryMock {
  _response;
  save() {
    return this._response;
  }
}