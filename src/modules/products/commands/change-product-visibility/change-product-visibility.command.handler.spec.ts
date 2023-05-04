import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ChangeProductVisibilityCommand } from './change-product-visibility.command';
import { ChangeProductVisibilityCommandHandler } from './change-product-visibility.command.handler';
import { ProductRepository } from '../../../products/repositories/product.repository';
import { ProductNotFoundException } from '../../exceptions/product-not-found.exception';
import { ProductVisibilityChangedEvent } from './events/change-product-visibility.event';

describe('ChangeProductVisibilityCommandHandler', () => {

  let handler: ChangeProductVisibilityCommandHandler;
  let productRepository: ProductRepositoryMock;
  let eventBus: EventBusMock;

  const companyId = "anyCompanyId";
  const userId = "anyUserId";
  const productId = "anyProductId";

  const command = new ChangeProductVisibilityCommand(
    companyId, userId, productId
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    productRepository = new ProductRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ChangeProductVisibilityCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<ChangeProductVisibilityCommandHandler>(ChangeProductVisibilityCommandHandler);
  });

  it('given product not found, then throw product not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(ProductNotFoundException);
  });

  describe('given product found', () => {

    beforeEach(() => {
        productRepository._findByCompanyIdAndIdResponse = {id: productId};
    })

    it('then change product visibility', async () => {
        await handler.execute(command);

        expect(productRepository._hasSetVisibility).toBeTruthy();
    })

    it('then publish product visibility changed event', async () => {
        await handler.execute(command);

        expect(eventBus.published).toBeInstanceOf(ProductVisibilityChangedEvent);
    })

  })

});

class ProductRepositoryMock {
    _findByCompanyIdAndIdResponse;
    _hasSetVisibility = false;
    findByCompanyIdAndId() {
        return this._findByCompanyIdAndIdResponse;
    }
    setVisibility() {
        this._hasSetVisibility = true;
    }
}