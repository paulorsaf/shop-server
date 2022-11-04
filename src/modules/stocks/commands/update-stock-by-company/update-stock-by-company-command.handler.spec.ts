import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateStockByCompanyCommand } from './update-stock-by-company.command';
import { UpdateStockByCompanyCommandHandler } from './update-stock-by-company-command.handler';
import { NotFoundException } from '@nestjs/common';
import { CompanyStockFactory } from './factories/company-stock.factory';
import { CompanyStockInterface } from './repositories/company-stock.interface';
import { CompanyStockProduct } from './models/company-product-stock.model';
import { ProductStockRepository } from './repositories/product-stock.repository';
import { CompanyTotalStockUpdatedEvent } from '../../events/company-total-stock-updated.event';

describe('UpdateStockByCompanyCommandHandler', () => {

  let handler: UpdateStockByCompanyCommandHandler;
  let eventBus: EventBusMock;
  const command = new UpdateStockByCompanyCommand(
    'anyCompanyId', 'anyUserId'
  );

  let companyStockFactory: CompanyStockFactoryMock;
  let productStockRepository: ProductStockRepositoryMock;

  beforeEach(async () => {
    companyStockFactory = new CompanyStockFactoryMock();
    eventBus = new EventBusMock();
    productStockRepository = new ProductStockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateStockByCompanyCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanyStockFactory,
        ProductStockRepository
      ]
    })
    .overrideProvider(CompanyStockFactory).useValue(companyStockFactory)
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(ProductStockRepository).useValue(productStockRepository)
    .compile();

    handler = module.get<UpdateStockByCompanyCommandHandler>(UpdateStockByCompanyCommandHandler);
  });

  it('given company stock update not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  describe('given company stock update found', () => {

    let anyCompanyStockRepository: AnyCompanyStockRepositoryMock;

    beforeEach(() => {
      anyCompanyStockRepository = new AnyCompanyStockRepositoryMock();
      anyCompanyStockRepository._response = [
        { isPromotion: false, price: 10, productInternalId: "anyInternalId", totalStock: 10 }
      ];
      companyStockFactory._response = anyCompanyStockRepository;
    })

    it('then find all products on stock to update', async () => {
      await handler.execute(command);

      expect(anyCompanyStockRepository._isFound).toBeTruthy();
    })

    it('when products to update found, then update products', async () => {
      await handler.execute(command);

      expect(productStockRepository._isStockAmountUpdated).toBeTruthy();
    })

    it('then publish company total stock updated event', async () => {
      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new CompanyTotalStockUpdatedEvent(
          "anyCompanyId", "anyUserId"
        )
      );
    })

  })

});

class CompanyStockFactoryMock {
  _response;
  createStock() {
    return this._response;
  }
}

class AnyCompanyStockRepositoryMock implements CompanyStockInterface {
  _isFound = false;
  _response;

  findAll(): Promise<CompanyStockProduct[]> {
    this._isFound = true;
    return this._response;
  }
}

class ProductStockRepositoryMock {
  _isStockAmountUpdated = false;
  updateStockAmount() {
    this._isStockAmountUpdated = true;
  }
}