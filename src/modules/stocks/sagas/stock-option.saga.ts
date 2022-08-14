import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { UpdateProductStockCommand } from "../commands/update-product-stock/update-product-stock.command";
import { StockOptionAddedEvent } from "../commands/add-stock-option/events/stock-option-added.event";
import { StockCreatedEvent } from "../commands/create-stock/events/stock-created.event";
import { StockOptionRemovedEvent } from "../commands/remove-stock-option/events/stock-option-removed.event";
import { StockOptionUpdatedEvent } from "../commands/update-stock-option/events/stock-option-updated.event";

@Injectable()
export class StockOptionSagas {

    @Saga()
    stockCreated = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(StockCreatedEvent),
            map(event => new UpdateProductStockCommand(
                event.companyId, event.productId, event.stock.stockOption.quantity, event.userId
            ))
        );

    @Saga()
    stockOptionAdded = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(StockOptionAddedEvent),
            map(event => new UpdateProductStockCommand(
                event.companyId, event.productId, event.stockOption.quantity, event.userId
            ))
        );

    @Saga()
    stockOptionRemoved = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(StockOptionRemovedEvent),
            map(event => new UpdateProductStockCommand(
                event.companyId, event.productId, -event.stock.stockOption.quantity, event.userId
            ))
        );

    @Saga()
    stockOptionUpdated = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(StockOptionUpdatedEvent),
            map(event => new UpdateProductStockCommand(
                event.companyId, event.productId,
                event.stockOption.quantity - event.originalStockOption.quantity,
                event.userId
            ))
        );

}