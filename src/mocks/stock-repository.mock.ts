export class StockRepositoryMock {

    addedWith: any;
    searchedById: string = "";

    response: any;

    addStock(params: any) {
        this.addedWith = params;
    }

    findByProduct(productId: string) {
        this.searchedById = productId;
        return this.response;
    }

}