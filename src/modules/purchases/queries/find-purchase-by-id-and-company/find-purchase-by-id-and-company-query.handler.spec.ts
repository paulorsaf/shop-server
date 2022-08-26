import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseSummary } from '../../model/purchase-summary.model';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { FindPurchaseByIdAndCompanyQueryHandler } from './find-purchase-by-id-and-company-query.handler';
import { FindPurchaseByIdAndCompanyQuery } from './find-purchase-by-id-and-company.query';

describe('FindPurchaseByIdAndCompanyQueryHandler', () => {

  let handler: FindPurchaseByIdAndCompanyQueryHandler;
  let purchaseRepository: PurchaseRepositoryMock;

  const command = new FindPurchaseByIdAndCompanyQuery(
    'anyCompanyId', "anyPurchaseId"
  );

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindPurchaseByIdAndCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository
      ]
    })
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<FindPurchaseByIdAndCompanyQueryHandler>(FindPurchaseByIdAndCompanyQueryHandler);
  });

  it('given found purchase by id and company, then return purchase', async () => {
    const purchases = {id: 1} as any;
    purchaseRepository._response = purchases;

    const response = await handler.execute(command);

    expect(response).toEqual(purchases);
  });

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

});

class PurchaseRepositoryMock {
  _foundWith;
  _response;

  findByIdAndCompany(params){
    return this._response;
  }
}