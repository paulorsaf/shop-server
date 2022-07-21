export class ProductImageRepositoryMock {

    addedWith: any;
    deletedWith: any;

    response: any;

    addImage(model: any) {
        this.addedWith = model;
        return this.response;
    }
    removeImage(model: any){
        this.deletedWith = model;
    }

}