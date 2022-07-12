import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../repositories/event.repository";
import { ProductUpdatedEvent } from "./product-updated.event";

@EventsHandler(ProductUpdatedEvent)
export class ProductUpdatedEventHandler implements IEventHandler<ProductUpdatedEvent> {

    constructor(
        private eventRepository: EventRepository
    ){}

    async handle(event: ProductUpdatedEvent) {
        this.eventRepository.addEvent(event);
    }

}