import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../../repositories/event.repository";
import { StockCreatedEvent } from "./stock-created.event";

@EventsHandler(StockCreatedEvent)
export class StockCreatedEventHandler implements IEventHandler<StockCreatedEvent> {

    constructor(
        private eventRepository: EventRepository
    ){}

    handle(event: StockCreatedEvent) {
        this.eventRepository.addEvent(
            new StockCreatedEvent(
                event.companyId, event.productId, event.stock, event.userId
            )
        )
    }

}