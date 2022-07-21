import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { DeleteProductFileCommand } from "../../storage/commands/delete-product-file/delete-product-file.command";
import { ProductImageDeletedEvent } from "../commands/delete-product-image/events/product-image-deleted.event";

@Injectable()
export class ProductImageSagas {

    @Saga()
    productImageDeleted = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(ProductImageDeletedEvent),
            map(event => new DeleteProductFileCommand(
                event.companyId, event.productId, event.image.fileName, event.userId
            ))
        );

}