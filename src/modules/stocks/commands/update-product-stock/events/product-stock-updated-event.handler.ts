import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../../repositories/event.repository";
import { ProductStockUpdatedEvent } from "./product-stock-updated.event";

@EventsHandler(ProductStockUpdatedEvent)
export class ProductStockUpdatedEventHandler implements IEventHandler<ProductStockUpdatedEvent> {

    constructor(
        private eventRepository: EventRepository
    ){}

    handle(event: ProductStockUpdatedEvent) {
        this.eventRepository.addEvent(event);
    }

}