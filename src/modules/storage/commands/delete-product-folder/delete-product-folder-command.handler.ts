import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StorageRepository } from "../../repositories/storage.repository";
import { DeleteProductFolderCommand } from "./delete-product-folder.command";
import { ProductFolderDeletedEvent } from "./events/product-folder-deleted.event";

@CommandHandler(DeleteProductFolderCommand)
export class DeleteFolderCommandHandler implements ICommandHandler<DeleteProductFolderCommand> {

    constructor(
        private eventBus: EventBus,
        private storageRepository: StorageRepository
    ){}

    async execute(command: DeleteProductFolderCommand) {
        await this.storageRepository.deleteFolder({
            companyId: command.companyId,
            productId: command.productId
        });

        this.publishFolderDeletedEvent(command);
    }

    private publishFolderDeletedEvent(command: DeleteProductFolderCommand) {
        this.eventBus.publish(
            new ProductFolderDeletedEvent(
                command.companyId, command.productId, command.deletedBy
            )
        )
    }

}