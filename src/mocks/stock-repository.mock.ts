export class StockRepositoryMock {

    searchedById: string = "";

    response: any;

    findByProduct(productId: string) {
        this.searchedById = productId;
        return this.response;
    }

}