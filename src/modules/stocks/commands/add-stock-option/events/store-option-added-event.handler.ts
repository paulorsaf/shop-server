import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EventRepository } from "../../../../../repositories/event.repository";
import { StockOptionAddedEvent } from "./stock-option-added.event";

@EventsHandler(StockOptionAddedEvent)
export class StockOptionAddedEventHandler implements IEventHandler<StockOptionAddedEvent> {

    constructor(
        private eventRepository: EventRepository
    ){}

    handle(event: StockOptionAddedEvent) {
        this.eventRepository.addEvent(event);
    }

}