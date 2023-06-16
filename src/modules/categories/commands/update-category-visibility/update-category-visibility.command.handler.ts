import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CategoryRepository } from "../../repositories/category.repository";
import { CategoryVisibilityUpdatedEvent } from "./events/category-visibility-updated.event";
import { UpdateCategoryVisibilityCommand } from "./update-category-visibility.command";

@CommandHandler(UpdateCategoryVisibilityCommand)
export class UpdateCategoryVisibilityCommandHandler implements ICommandHandler<UpdateCategoryVisibilityCommand> {
  
    constructor(
        private categoryRepository: CategoryRepository,
        private eventBus: EventBus
    ) {}

    async execute(command: UpdateCategoryVisibilityCommand) {
        const category = await this.findCategory(command);

        const isVisible = !category.isVisible;
        this.categoryRepository.updateVisibility({
            categoryId: category.id,
            isVisible
        });

        this.publishCategoryVisibilityUpdatedEvent(command, isVisible);
    }

    private async findCategory(command: UpdateCategoryVisibilityCommand) {
        const category = await this.categoryRepository.findById(command.categoryId);
        if (!category) {
            throw new NotFoundException();
        }
        if (category.companyId !== command.companyId) {
            throw new UnauthorizedException();
        }
        return category;
    }

    private publishCategoryVisibilityUpdatedEvent(
        command: UpdateCategoryVisibilityCommand, isVisible: boolean
    ) {
        this.eventBus.publish(
            new CategoryVisibilityUpdatedEvent(
                command.companyId,
                command.userId,
                command.categoryId,
                isVisible
            )
        );
    }

}