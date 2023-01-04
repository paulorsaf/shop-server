import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CancelPurchaseProductCommand } from './cancel-purchase-product.command';
import { CancelPurchaseProductCommandHandler } from './cancel-purchase-product.command.handler';
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { NotFoundException } from '@nestjs/common';
import { PurchaseProductQuantityEditedEvent } from '../../events/purchase-product-quantity-edited.event';
import { PurchaseProductCancelledEvent } from '../../events/purchase-product-cancelled.event';

describe('CancelPurchaseProductCommandHandler', () => {

  let handler: CancelPurchaseProductCommandHandler;
  let eventBus: EventBusMock;
  let purchaseRepository: PurchaseRepositoryMock;

  const command = new CancelPurchaseProductCommand(
    'anyCompanyId', 'anyUserId', 'anyPurchaseId', 'anyProductId', 'anyStockId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CancelPurchaseProductCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<CancelPurchaseProductCommandHandler>(CancelPurchaseProductCommandHandler);
  });

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {
        id: "anyPurchaseId",
        products: [
          {id: "anyProductId1", stock: {id: "anyStockId1"}},
          {id: "anyProductId2", stock: {id: "anyStockId2"}}
        ]
      };
    })

    it('when purchase product not found, then throw not found exception', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    })

    it('then cancel purchase product', async () => {
      purchaseRepository._response.products.push({
        id: "anyProductId", stock: {id: "anyStockId"}, unit: 'UN'
      });

      await handler.execute(command);
  
      expect(purchaseRepository._hasCanceledPurchasePrice).toBeTruthy();;
    });

    it('then publish purchase product cancelled event', async () => {
      purchaseRepository._response.products.push({
        id: "anyProductId", stock: {id: "anyStockId"}, unit: 'UN'
      });

      await handler.execute(command);
  
      expect(eventBus.published).toBeInstanceOf(PurchaseProductCancelledEvent);
    });

    it('then update purchase price', async () => {
      purchaseRepository._response.products.push({
        id: "anyProductId", stock: {id: "anyStockId"}, unit: 'UN'
      });

      await handler.execute(command);
  
      expect(purchaseRepository._hasUpdatePurchasePrice).toBeTruthy();;
    });

  })

});

class PurchaseRepositoryMock {
  _hasCanceledPurchasePrice = false;
  _hasUpdatePurchasePrice = false;
  _response;

  findByIdAndCompany() {
    return this._response
  }
  cancelPurchaseProduct() {
    this._hasCanceledPurchasePrice = true;
  }
  updatePurchasePrice() {
    this._hasUpdatePurchasePrice = true;
  }
}