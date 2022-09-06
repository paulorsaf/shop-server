import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { FindCompanyByIdQueryHandler } from './find-company-by-id-query.handler';
import { FindCompanyByIdQuery } from './find-company-by-id.query';
import { Company } from '../../models/company.model';
import { CompanyRepository } from '../../repositories/company.repository';
import { NotFoundException } from '@nestjs/common';

describe('FindCompanyByIdQueryHandler', () => {

  let handler: FindCompanyByIdQueryHandler;

  const command = new FindCompanyByIdQuery(
    'anyCompanyId',
    {companyId: "anyCompanyId", id: "anyUserId"}
  );
  let companyRepository: CompanyServiceMock;

  beforeEach(async () => {
    companyRepository = new CompanyServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindCompanyByIdQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanyRepository
      ]
    })
    .overrideProvider(CompanyRepository).useValue(companyRepository)
    .compile();

    handler = module.get<FindCompanyByIdQueryHandler>(FindCompanyByIdQueryHandler);
  });

  describe('given company found', () => {

    it('then return company', async () => {
      const company = new Company({id: "anyCompanyId"});
      companyRepository._response = company;
  
      const response = await handler.execute(command);
  
      expect(response).toEqual(company);
    });

    it('when user doesnt belong to company, return throw not found exception', async () => {
      const company = new Company({id: "anyOtherCompanyId"});
      companyRepository._response = company;
  
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    });

  })

  describe('given company not found', () => {

    it('when user doesnt belong to company, return throw not found exception', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    });

  })

});

class CompanyServiceMock {
  _response;
  findById() {
    return this._response;
  }
}