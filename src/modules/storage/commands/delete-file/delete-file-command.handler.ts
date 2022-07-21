import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StorageRepository } from "../../repositories/storage.repository";
import { DeleteFileCommand } from "./delete-file.command";
import { ImageFileDeletedEvent } from "./events/image-file-deleted.event";

@CommandHandler(DeleteFileCommand)
export class DeleteFileCommandHandler implements ICommandHandler<DeleteFileCommand> {

    constructor(
        private eventBus: EventBus,
        private storageRepository: StorageRepository
    ){}

    async execute(command: DeleteFileCommand) {
        await this.storageRepository.deleteImage({
            companyId: command.companyId,
            fileName: command.fileName,
            productId: command.productId
        })

        this.publishImageFileDeletedEvent(command);
    }

    private publishImageFileDeletedEvent(command: DeleteFileCommand) {
        this.eventBus.publish(
            new ImageFileDeletedEvent(
                command.companyId, command.productId, command.fileName, command.deletedBy
            )
        );
    }

}