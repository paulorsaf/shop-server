export class StorageRepositoryMock {

    deletedWith: any;
    savedWith: any;

    response: any;

    save(model: any) {
        this.savedWith = model;
        return this.response;
    }
    deleteImage(model: any) {
        this.deletedWith = model;
    }

}