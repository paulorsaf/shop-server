export class CategoryRepositoryMock {

    addedWith: any;
    addedEvent: string;
    savedWith: any;

    response: any;

    addEvent(event: any) {
        this.addedEvent = event;
    }

    findByCompany(companyId: string) {
        return this.response;
    }

    save(model: any) {
        this.savedWith = model;
        return {
            ...model,
            id: '1'
        };
    }

}