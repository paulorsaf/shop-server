export class ProductImageRepositoryMock {

    addedWith: any;

    response: any;

    addImage(model: any) {
        this.addedWith = model;
        return this.response;
    }

}