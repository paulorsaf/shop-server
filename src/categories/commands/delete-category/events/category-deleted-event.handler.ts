import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../repositories/event.repository";
import { CategoryDeletedEvent } from "./category-deleted.event";

@EventsHandler(CategoryDeletedEvent)
export class CategoryDeletedEventHandler implements IEventHandler<CategoryDeletedEvent> {

    constructor(
        private eventRepository: EventRepository
    ) {}

    handle(event: CategoryDeletedEvent) {
        this.eventRepository.addEvent(event);
    }

}