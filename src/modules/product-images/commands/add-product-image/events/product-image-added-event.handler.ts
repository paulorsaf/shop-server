import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../../repositories/event.repository";
import { ProductImageAddedEvent } from "./product-image-added.event";

@EventsHandler(ProductImageAddedEvent)
export class ProductImageAddedEventHandler implements IEventHandler<ProductImageAddedEvent> {

    constructor(
        private eventRepository: EventRepository
    ) {}

    handle(event: ProductImageAddedEvent) {
        this.eventRepository.addEvent(event);
    }

}