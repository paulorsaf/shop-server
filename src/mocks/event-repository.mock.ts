export class EventRepositoryMock {
    
    addedEvent: string;

    addEvent(event: any) {
        this.addedEvent = event;
    }

}