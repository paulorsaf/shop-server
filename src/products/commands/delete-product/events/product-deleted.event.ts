export class ProductDeletedEvent {
    private readonly eventType = "PRODUCT_DELETED_EVENT";
    constructor(
        public readonly product: Product,
        public readonly companyId: string,
        public readonly userId: string
    ) {}
}
  
type Product = {
    id: string
}