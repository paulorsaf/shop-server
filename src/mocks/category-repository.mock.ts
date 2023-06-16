export class CategoryRepositoryMock {

    addedWith: any;
    deletedWith: any;
    savedWith: any;
    updatedWith: any;

    response: any;

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

    updateVisibility(model: any) {
        this.updatedWith = model;
    }

}