export class ProductRepositoryMock {

    updatedStockWith: any;

    response: any;

    findById(params: any) {
        return this.response;
    }
    updateStockAmount(params: any) {
        this.updatedStockWith = params;
    }

}