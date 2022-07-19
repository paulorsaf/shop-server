export class StorageRepositoryMock {

    savedWith: any;

    response: any;

    save(model: any) {
        this.savedWith = model;
        return this.response;
    }

}