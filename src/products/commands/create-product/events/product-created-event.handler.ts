import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../repositories/event.repository";
import { ProductCreatedEvent } from "./product-created.event";

@EventsHandler(ProductCreatedEvent)
export class ProductCreatedEventHandler implements IEventHandler<ProductCreatedEvent> {

    constructor(
        private eventRepository: EventRepository
    ) {}

    handle(event: ProductCreatedEvent) {
        return this.eventRepository.addEvent(event);
    }
}