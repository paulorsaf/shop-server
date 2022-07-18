import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CategoryRepository } from "../../repositories/category.repository";
import { DeleteCategoryCommand } from "./delete-category.command";
import { CategoryDeletedEvent } from "./events/category-deleted.event";

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryCommandHandler implements ICommandHandler<DeleteCategoryCommand> {
  
    constructor(
        private categoryRepository: CategoryRepository,
        private eventBus: EventBus
    ) {}

    async execute(command: DeleteCategoryCommand) {
        const category = await this.categoryRepository.findById(command.id);
        if (category.companyId !== command.companyId) {
            throw new UnauthorizedException();
        }

        await this.categoryRepository.delete(command.id);

        this.eventBus.publish(
            new CategoryDeletedEvent(
                {id: command.id, name: category.name},
                category.companyId,
                command.userId
            )
        );
    }

}