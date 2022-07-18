export class StockRepositoryMock {

    addedWith: any;
    addedWithId: string;
    createdWith: any;
    searchedById: string = "";

    response: any;

    createStock(params: any) {
        this.createdWith = params;
    }
    findByProduct(productId: string) {
        this.searchedById = productId;
        return this.response;
    }
    addStockOption(id: string, params: any) {
        this.addedWithId = id;
        this.addedWith = params;
    }

}