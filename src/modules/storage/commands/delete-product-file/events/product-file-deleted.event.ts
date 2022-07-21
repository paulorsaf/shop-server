export class ProductFileDeletedEvent {
    private readonly eventType = "PRODUCT_FILE_DELETED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly fileName: string,
        public readonly userId: string
    ){}
}