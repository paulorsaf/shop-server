export class RepositoryMock {

    addedWith: any;
    addedEvent: string;
    deletedWith: any;
    savedWith: any;
    updatedWith: any;

    response: any;

    addEvent(event: any) {
        this.addedEvent = event;
    }

    delete(id: string) {
        this.deletedWith = id;
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