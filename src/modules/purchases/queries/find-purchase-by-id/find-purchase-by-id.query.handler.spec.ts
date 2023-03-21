import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { FindPurchaseByIdQueryHandler } from './find-purchase-by-id.query.handler';
import { FindPurchaseByIdQuery } from './find-purchase-by-id.query';

describe('FindPurchaseByIdQueryHandler', () => {

  let handler: FindPurchaseByIdQueryHandler;
  let purchaseRepository: PurchaseRepositoryMock;

  const command = new FindPurchaseByIdQuery(
    "anyPurchaseId"
  );

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindPurchaseByIdQueryHandler
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

    handler = module.get<FindPurchaseByIdQueryHandler>(FindPurchaseByIdQueryHandler);
  });

  it('given purchase id, when purchase found, then return purchase', async () => {
    const purchase = {id: 1} as any;
    purchaseRepository._response = purchase;

    const response = await handler.execute(command);

    expect(response).toEqual(purchase);
  });

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

});

class PurchaseRepositoryMock {
  _response;

  findById(){
    return this._response;
  }
}