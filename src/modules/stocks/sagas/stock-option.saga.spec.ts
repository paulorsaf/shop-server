import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { StockOptionAddedEvent } from '../commands/add-stock-option/events/stock-option-added.event';
import { StockOptionSagas } from './stock-option.saga';
import { StockOptionRemovedEvent } from '../commands/remove-stock-option/events/stock-option-removed.event';
import { UpdateProductStockCommand } from '../commands/update-product-stock/update-product-stock.command';
import { StockOptionUpdatedEvent } from '../commands/update-stock-option/events/stock-option-updated.event';

describe('StockOptionSagas', () => {

  let sagas: StockOptionSagas;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        StockOptionSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<StockOptionSagas>(StockOptionSagas);
  });

  it('given stock option added, then publish update product stock command', done => {
    const event = new StockOptionAddedEvent(
      'anyCompanyId', 'anyProductId', {
        id: "anyStockId", quantity: 10, color: "anyColor", size: "anySize"
      }, 'anyUserId'
    );

    sagas.stockOptionAdded(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockCommand(
          event.companyId, event.productId, event.userId
        )
      );
      done();
    });
  });

  it('given stock option removed, then publish update product stock command', done => {
    const event = new StockOptionRemovedEvent(
      'anyCompanyId', 'anyProductId', "anyStockId", 'anyUserId'
    );

    sagas.stockOptionRemoved(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockCommand(
          event.companyId, event.productId, event.userId
        )
      );
      done();
    });
  });

  it('given stock option updated, then publish update product stock command', done => {
    const event = new StockOptionUpdatedEvent(
      'anyCompanyId', 'anyProductId', 'anyStockId', {
        quantity: 5, color: "anyColor", size: "anySize"
      }, 'anyUserId'
    );

    sagas.stockOptionUpdated(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockCommand(
          event.companyId, event.productId, event.userId
        )
      );
      done();
    });
  });

});
