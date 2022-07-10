export class CategoryRepositoryMock {

    addedWith: any;
    addedEvent: string;
    savedWith: any;

    addEvent(event: any) {
        this.addedEvent = event;
    }

    save(model: any) {
        this.savedWith = model;
        return {
            ...model,
            id: '1'
        };
    }

}