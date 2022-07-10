import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Category, CategoryUser } from "../../entities/category";
import { CategoryCreatedEvent } from "../events/category-created.event";
import { CategoryRepository } from "../../repositories/category.repository";
import { CreateCategoryCommand } from "./create-category.command";

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryCommandHandler implements ICommandHandler<CreateCategoryCommand> {
  
    constructor(
        private categoryRepository: CategoryRepository,
        private eventBus: EventBus
    ) {}

    async execute(command: CreateCategoryCommand) {
        const category = new Category(null, command.name);
        const savedCategory = await this.categoryRepository.save(category);

        this.eventBus.publish(new CategoryCreatedEvent(
            new Category(savedCategory.id, command.name),
            new Date().toISOString(),
            command.user
        ));
    }

}