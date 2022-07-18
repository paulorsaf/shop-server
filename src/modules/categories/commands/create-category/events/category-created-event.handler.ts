import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../../repositories/event.repository";
import { CategoryCreatedEvent } from "./category-created.event";

@EventsHandler(CategoryCreatedEvent)
export class CategoryCreatedEventHandler implements IEventHandler<CategoryCreatedEvent> {

    constructor(
        private eventRepository: EventRepository
    ) {}

    handle(event: CategoryCreatedEvent) {
        this.eventRepository.addEvent(event);
    }

}