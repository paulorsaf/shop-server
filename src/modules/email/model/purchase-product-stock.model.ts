export class PurchaseProductStock {

    readonly color: string;
    readonly size: string;

    constructor(params: StockParams){
        this.color = params.color;
        this.size = params.size;
    }

}

type StockParams = {
    color?: string;
    size?: string;
}