export class Purchase {
    
    readonly id: string;
    readonly createdAt: string;
    readonly reason: string;
    readonly status: string;

    constructor(params: PurchaseParams){
        this.id = params.id;
        this.createdAt = params.createdAt;
        this.reason = params.reason;
        this.status = params.status;
    }

}

type PurchaseParams = {
    id?: string;
    createdAt?: string;
    reason?: string;
    status?: string;
}