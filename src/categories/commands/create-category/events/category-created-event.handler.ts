import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CategoryRepository } from "../../../repositories/category.repository";
import { CategoryCreatedEvent } from "./category-created.event";

@EventsHandler(CategoryCreatedEvent)
export class CategoryCreatedEventHandler implements IEventHandler<CategoryCreatedEvent> {

    constructor(
        private categoryRepository: CategoryRepository
    ) {}

    handle(event: CategoryCreatedEvent) {
        this.categoryRepository.addEvent(event);
    }

}