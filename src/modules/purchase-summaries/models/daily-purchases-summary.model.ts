export class DailyPurchasesSummary {
    
    readonly id: string;
    readonly purchases: DailyPurchases;

    constructor(params: PurchaseParams){
        this.id = params.id;
        this.purchases = params.purchases;
    }

}

export type DailyPurchases = {
    [purchaseId: string]: PurchaseSummary;
}

export type PurchaseSummary = {
    createdAt: string;
    id: string;
    status: string;
}

type PurchaseParams = {
    id?: string;
    purchases?: DailyPurchases;
}