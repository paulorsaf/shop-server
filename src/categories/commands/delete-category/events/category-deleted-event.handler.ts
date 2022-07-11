import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { CategoryRepository } from "../../../repositories/category.repository";
import { CategoryDeletedEvent } from "./category-deleted.event";

@EventsHandler(CategoryDeletedEvent)
export class CategoryDeletedEventHandler implements IEventHandler<CategoryDeletedEvent> {

    constructor(
        private categoryRepository: CategoryRepository
    ) {}

    handle(event: CategoryDeletedEvent) {
        this.categoryRepository.addEvent(event);
    }

}