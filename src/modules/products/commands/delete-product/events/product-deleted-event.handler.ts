import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../../repositories/event.repository";
import { ProductDeletedEvent } from "./product-deleted.event";

@EventsHandler(ProductDeletedEvent)
export class ProductDeletedEventHandler implements IEventHandler<ProductDeletedEvent> {

    constructor(
        private eventRepository: EventRepository
    ) {}

    handle(event: ProductDeletedEvent) {
        this.eventRepository.addEvent(event);
    }

}