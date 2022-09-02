import { PurchaseProductStock } from "./purchase-product-stock.model";

export class PurchaseProduct {

    readonly amount: number;
    readonly name: string;
    readonly price: number;
    readonly priceWithDiscount: number;
    readonly stock: PurchaseProductStock;
    readonly totalPrice: number;

    constructor(param: PurchaseParam) {
        this.amount = param.amount;
        this.name = param.name;
        this.price = param.price;
        this.priceWithDiscount = param.priceWithDiscount;
        this.stock = param.stock;
        this.totalPrice = this.calculateTotalPrice();
    }

    private calculateTotalPrice() {
        let price = this.priceWithDiscount || this.price;
        return this.amount * price;
    }

}

type PurchaseParam = {
    amount?: number;
    name?: string;
    price?: number;
    priceWithDiscount?: number;
    stock: PurchaseProductStock;
}