import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { DeleteProductFolderCommand } from "../../storage/commands/delete-product-folder/delete-product-folder.command";
import { RemoveStockByProductCommand } from "../../stocks/commands/remove-stock-by-product/remove-stock-by-product.command";
import { ProductDeletedEvent } from "../commands/delete-product/events/product-deleted.event";

@Injectable()
export class ProductSagas {

    @Saga()
    productDeletedToRemoveStock = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(ProductDeletedEvent),
            map(event => new RemoveStockByProductCommand(
                event.companyId, event.product.id, event.userId
            ))
        );

    @Saga()
    productDeletedToRemoveImagesFolder = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(ProductDeletedEvent),
            map(event => new DeleteProductFolderCommand(
                event.companyId, event.product.id, event.userId
            ))
        );

}