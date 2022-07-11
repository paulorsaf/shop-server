import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CategoryRepository } from "../../../repositories/category.repository";
import { CategoryUpdatedEvent } from "./category-updated.event";

@EventsHandler(CategoryUpdatedEvent)
export class CategoryUpdatedEventHandler implements IEventHandler<CategoryUpdatedEvent> {

    constructor(
        private categoryRepository: CategoryRepository
    ) {}

    handle(event: CategoryUpdatedEvent) {
        this.categoryRepository.addEvent(event);
    }

}