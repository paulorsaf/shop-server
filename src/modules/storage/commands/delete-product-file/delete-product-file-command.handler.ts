import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StorageRepository } from "../../repositories/storage.repository";
import { DeleteProductFileCommand } from "./delete-product-file.command";
import { ProductFileDeletedEvent } from "./events/product-file-deleted.event";

@CommandHandler(DeleteProductFileCommand)
export class DeleteProductFileCommandHandler implements ICommandHandler<DeleteProductFileCommand> {

    constructor(
        private eventBus: EventBus,
        private storageRepository: StorageRepository
    ){}

    async execute(command: DeleteProductFileCommand) {
        await this.storageRepository.deleteImage({
            companyId: command.companyId,
            fileName: command.fileName,
            productId: command.productId
        })

        this.publishImageFileDeletedEvent(command);
    }

    private publishImageFileDeletedEvent(command: DeleteProductFileCommand) {
        this.eventBus.publish(
            new ProductFileDeletedEvent(
                command.companyId, command.productId, command.fileName, command.deletedBy
            )
        );
    }

}