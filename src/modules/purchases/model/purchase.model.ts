export class Purchase {

    readonly companyId: string;
    readonly userId: string;

    constructor(params: PurchaseParams){
        this.companyId = params.companyId;
        this.userId = params.userId;
    }

}

type PurchaseParams = {
    companyId: string;
    userId: string;
}