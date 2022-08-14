import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { UpdateProductStockCommand, StockOptionUpdatedEvent } from 'shop-shared-server/dist/src/index';
import { StockOptionAddedEvent } from '../commands/add-stock-option/events/stock-option-added.event';
import { StockOptionSagas } from './stock-option.saga';
import { StockCreatedEvent } from '../commands/create-stock/events/stock-created.event';
import { StockOptionRemovedEvent } from '../commands/remove-stock-option/events/stock-option-removed.event';
import { StockOption } from '../entities/stock';

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

  it('given stock created, then publish update product stock command', done => {
    const stockOption = new StockOption('anyId', 10, 'anyColor', 'anySize');
    const event = new StockCreatedEvent(
      'anyCompanyId', 'anyProductId', {id: 'anyId', stockOption}, 'anyUserId'
    );

    sagas.stockCreated(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockCommand(
          event.companyId, event.productId, event.stock.stockOption.quantity, event.userId
        )
      );
      done();
    });
  });

  it('given stock option added, then publish update product stock command', done => {
    const event = new StockOptionAddedEvent(
      'anyCompanyId', 'anyProductId', 'anyStockId', new StockOption(
        'anyOptionId', 10, 'anyColor', 'anySize'
      ), 'anyUserId'
    );

    sagas.stockOptionAdded(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockCommand(
          event.companyId, event.productId, event.stockOption.quantity, event.userId
        )
      );
      done();
    });
  });

  it('given stock option removed, then publish update product stock command', done => {
    const event = new StockOptionRemovedEvent(
      'anyCompanyId', 'anyProductId', {
        stockId: "anyStockId", stockOption: {
          id: "anyStockOptionId", quantity: -10, color: "anyColor", size: "anySize"
        }
      }, 'anyUserId'
    );

    sagas.stockOptionRemoved(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockCommand(
          event.companyId, event.productId, -event.stock.stockOption.quantity, event.userId
        )
      );
      done();
    });
  });

  it('given stock option updated, then publish update product stock command', done => {
    const event = new StockOptionUpdatedEvent(
      'anyCompanyId', 'anyProductId', 'anyStockId', {
        id: "anyStockOptionId", quantity: 5, color: "anyColor", size: "anySize"
      }, {
        id: "anyStockOptionId", quantity: 10, color: "anyColor", size: "anySize"
      }, 'anyUserId'
    );

    sagas.stockOptionUpdated(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockCommand(
          event.companyId,
          event.productId,
          event.stockOption.quantity - event.originalStockOption.quantity,
          event.userId
        )
      );
      done();
    });
  });

});
