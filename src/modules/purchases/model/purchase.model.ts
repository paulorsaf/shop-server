export class Purchase {

    readonly createdAt: string;
    readonly companyId: string;
    readonly payment: Payment;
    readonly products: PurchaseProduct[];
    readonly status: string;
    readonly totalAmount: number;
    readonly totalPrice: number;
    readonly user: User;

    constructor(params: PurchaseParams){
        this.createdAt = params.createdAt;
        this.companyId = params.companyId;
        this.payment = params.payment;
        this.products = params.products;
        this.status = params.status;
        this.totalAmount = this.getTotalAmount();
        this.totalPrice = this.getTotalPrice();
        this.user = params.user;
    }

    private getTotalAmount() {
        let total = 0;
        this.products?.forEach(p => {
            total += p.amount;
        })
        return total;
    }

    private getTotalPrice() {
        let total = 0;
        this.products?.forEach(p => {
            const price = p.priceWithDiscount || p.price;
            total += price * p.amount;
        })
        return total;
    }

}

type PurchaseParams = {
    companyId: string;
    createdAt?: string;
    payment?: Payment;
    products?: PurchaseProduct[];
    status?: string;
    user?: User;
}

type Payment = {
    error: any;
    receiptUrl: string;
    type: string;
}

type PurchaseProduct = {
    amount: number;
    price: number;
    priceWithDiscount: number;
}

type User = {
    email: string;
    id: string;
}