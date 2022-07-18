import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CategoryRepository } from "../../repositories/category.repository";
import { CreateCategoryCommand } from "./create-category.command";
import { CategoryCreatedEvent } from "./events/category-created.event";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand> {
  
    constructor(
        private categoryRepository: CategoryRepository,
        private eventBus: EventBus
    ) {}

    async execute(command: CreateCategoryCommand) {
        const savedCategory = await this.categoryRepository.save({
            companyId: command.companyId, name: command.name, createdBy: command.createdBy
        });

        this.eventBus.publish(
            new CategoryCreatedEvent(
                {id: savedCategory.id, name: savedCategory.name},
                savedCategory.companyId,
                savedCategory.createdBy
            )
        );
    }

}