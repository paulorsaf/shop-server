import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { Purchase } from '../../model/purchase.model';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { FindPurchasesByUserCompanyQueryHandler } from './find-purchases-by-user-company-query.handler';
import { FindPurchasesByUserCompanyQuery } from './find-purchases-by-user-company.query';

describe('FindPurchasesByUserCompanyQueryHandler', () => {

  let handler: FindPurchasesByUserCompanyQueryHandler;
  let purchaseRepository: PurchaseRepositoryMock;

  const command = new FindPurchasesByUserCompanyQuery('anyCompanyId', 'anyUserId');

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindPurchasesByUserCompanyQueryHandler
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

    handler = module.get<FindPurchasesByUserCompanyQueryHandler>(FindPurchasesByUserCompanyQueryHandler);
  });

  it('given find purchases by user company, then return purchases', async () => {
    const purchases = [{id: 1}, {id: 2}] as any;
    purchaseRepository._response = purchases;

    const response = await handler.execute(command);

    expect(response).toEqual(purchases);
  });

  it('given find purchases by user company, then find purchases with model', async () => {
    await handler.execute(command);

    expect(purchaseRepository._foundWith).toEqual(
      new Purchase({
        companyId: "anyCompanyId",
        userId: "anyUserId"
    })
    );
  });

});

class PurchaseRepositoryMock {
  _foundWith;
  _response;

  find(params){
    this._foundWith = params;
    return this._response;
  }
}