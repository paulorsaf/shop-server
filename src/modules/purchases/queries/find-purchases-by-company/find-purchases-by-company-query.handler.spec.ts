import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { FindPurchasesByUserQueryHandler } from './find-purchases-by-company-query.handler';
import { FindPurchasesByUserQuery } from './find-purchases-by-company.query';

describe('FindPurchasesByUserQueryHandler', () => {

  let handler: FindPurchasesByUserQueryHandler;
  let purchaseRepository: PurchaseRepositoryMock;

  const command = new FindPurchasesByUserQuery('anyCompanyId');

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindPurchasesByUserQueryHandler
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

    handler = module.get<FindPurchasesByUserQueryHandler>(FindPurchasesByUserQueryHandler);
  });

  it('given find purchases by user company, then return purchases', async () => {
    const purchases = [{id: 1}, {id: 2}] as any;
    purchaseRepository._response = purchases;

    const response = await handler.execute(command);

    expect(response).toEqual(purchases);
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