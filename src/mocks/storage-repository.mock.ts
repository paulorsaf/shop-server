export class StorageRepositoryMock {

    deletedWith: any;
    savedWith: any;

    response: any;

    save(model: any) {
        this.savedWith = model;
        return this.response;
    }
    deleteFolder(model: any) {
        this.deletedWith = model;
    }
    deleteImage(model: any) {
        this.deletedWith = model;
    }

}