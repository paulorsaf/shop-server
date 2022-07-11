export class CategoryRepositoryMock {

    addedWith: any;
    addedEvent: string;
    savedWith: any;
    updatedWith: any;

    response: any;

    addEvent(event: any) {
        this.addedEvent = event;
    }

    findByCompany(companyId: string) {
        return this.response;
    }

    findById() {
        return this.response;
    }

    save(model: any) {
        this.savedWith = model;
        return this.response;
    }

    update(model: any) {
        this.updatedWith = model;
    }

}