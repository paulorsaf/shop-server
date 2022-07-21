import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { DeleteFileCommand } from "../../storage/commands/delete-file/delete-file.command";
import { ProductImageDeletedEvent } from "../commands/delete-product-image/events/product-image-deleted.event";

@Injectable()
export class ProductImageSagas {

    @Saga()
    productImageDeleted = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(ProductImageDeletedEvent),
            map(event => new DeleteFileCommand(
                event.companyId, event.productId, event.image.fileName, event.userId
            ))
        );

}