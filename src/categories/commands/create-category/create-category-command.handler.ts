import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Category } from "../../entities/category";
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
        const category = new Category(null, command.name, command.user, command.companyId);
        const savedCategory = await this.categoryRepository.save(category);

        this.eventBus.publish(new CategoryCreatedEvent(
            new Category(savedCategory.id, command.name, command.user, command.companyId),
            new Date().toISOString()
        ));
    }

}