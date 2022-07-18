import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../../repositories/event.repository";
import { CategoryUpdatedEvent } from "./category-updated.event";

@EventsHandler(CategoryUpdatedEvent)
export class CategoryUpdatedEventHandler implements IEventHandler<CategoryUpdatedEvent> {

    constructor(
        private eventRepository: EventRepository
    ) {}

    handle(event: CategoryUpdatedEvent) {
        this.eventRepository.addEvent(event);
    }

}