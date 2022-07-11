import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CategoryRepository } from "../../repositories/category.repository";
import { CategoryUpdatedEvent } from "./events/category-updated.event";
import { UpdateCategoryCommand } from "./update-category.command";

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryCommandHandler implements ICommandHandler<UpdateCategoryCommand> {
  
    constructor(
        private categoryRepository: CategoryRepository,
        private eventBus: EventBus
    ) {}

    async execute(command: UpdateCategoryCommand) {
        const category = await this.categoryRepository.findById(command.id);
        if (category.companyId !== command.companyId) {
            throw new UnauthorizedException();
        }

        this.categoryRepository.update({
            id: command.id, name: command.name
        });

        this.eventBus.publish(new CategoryUpdatedEvent(
            {id: command.id, name: command.name},
            command.companyId,
            command.userId
        ));
    }

}