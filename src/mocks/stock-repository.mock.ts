export class StockRepositoryMock {

    addedWith: any;
    addedWithId: string;
    createdWith: any;
    removedWith: any;
    searchedById: string = "";
    updatedWith: any;

    response: any;

    addStockOption(id: string, params: any) {
        this.addedWithId = id;
        this.addedWith = params;
    }
    createStock(params: any) {
        this.createdWith = params;
    }
    findByProduct(productId: string) {
        this.searchedById = productId;
        return this.response;
    }
    removeStock(params: any) {
        this.removedWith = params;
    }
    removeStockOption(params: any) {
        this.removedWith = params;
    }
    updateStockOption(params: any) {
        this.updatedWith = params;
    }

}