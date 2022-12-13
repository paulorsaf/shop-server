import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { EditPurchaseProductQuantityCommand } from './edit-purchase-product-quantity.command';
import { EditPurchaseProductQuantityCommandHandler } from './edit-purchase-product-quantity.command.handler';
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { NotFoundException } from '@nestjs/common';
import { PurchaseProductQuantityEditedEvent } from '../../events/purchase-product-quantity-edited.event';

describe('EditPurchaseProductQuantityCommandHandler', () => {

  let handler: EditPurchaseProductQuantityCommandHandler;
  let eventBus: EventBusMock;
  let purchaseRepository: PurchaseRepositoryMock;

  const command = new EditPurchaseProductQuantityCommand(
    'anyCompanyId', 'anyUserId', 'anyPurchaseId', 'anyProductId', 'anyStockId', 10
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        EditPurchaseProductQuantityCommandHandler
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

    handler = module.get<EditPurchaseProductQuantityCommandHandler>(EditPurchaseProductQuantityCommandHandler);
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

    it('when product unit is UN, then update amount with amount sent by user', async () => {
      purchaseRepository._response.products.push({
        id: "anyProductId", stock: {id: "anyStockId"}, unit: 'UN'
      });

      await handler.execute(command);
  
      expect(purchaseRepository._updatedAmountWith.amount).toEqual(10);
    });

    it('when product unit is KG, then update amount with amount relative to product weight', async () => {
      purchaseRepository._response.products.push({
        id: "anyProductId", stock: {id: "anyStockId"}, unit: 'KG', weight: 5
      });

      await handler.execute(command);
  
      expect(purchaseRepository._updatedAmountWith.amount).toEqual(2);
    });

    it('then update purchase price', async () => {
      purchaseRepository._response.products.push({
        id: "anyProductId", stock: {id: "anyStockId"}, unit: 'UN'
      });

      await handler.execute(command);
  
      expect(purchaseRepository._hasUpdatePurchasePrice).toBeTruthy();;
    });

    it('then publish purchase product quantity edited event', async () => {
      purchaseRepository._response.products.push({
        id: "anyProductId", stock: {id: "anyStockId"}, unit: 'UN'
      });

      await handler.execute(command);
  
      expect(eventBus.published).toBeInstanceOf(PurchaseProductQuantityEditedEvent);
    });

  })

});

class PurchaseRepositoryMock {
  _hasUpdatePurchasePrice = false;
  _response;
  _updatedAmountWith: any;

  findByIdAndCompany() {
    return this._response
  }
  updateProductAmount(value: number){
    this._updatedAmountWith = value;
  }
  updatePurchasePrice() {
    this._hasUpdatePurchasePrice = true;
  }
}