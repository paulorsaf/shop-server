export class StockRepositoryMock {

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

}