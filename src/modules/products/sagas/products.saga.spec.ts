import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { RemoveStockByProductCommand } from '../../stocks/commands/remove-stock-by-product/remove-stock-by-product.command';
import { ProductDeletedEvent } from '../commands/delete-product/events/product-deleted.event';
import { ProductSagas } from './products.saga';

describe('ProductSagas', () => {

  let sagas: ProductSagas;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<ProductSagas>(ProductSagas);
  });

  it('given product removed, then publish remove stock command', done => {
    const event = new ProductDeletedEvent(
      'anyCompanyId', {
        id: "anyProductId"
      }, 'anyUserId'
    );

    sagas.stockRemoved(of(event)).subscribe(response => {
      expect(response).toEqual(
        new RemoveStockByProductCommand(
          event.companyId, event.product.id, event.userId
        )
      );
      done();
    });
  });

});
