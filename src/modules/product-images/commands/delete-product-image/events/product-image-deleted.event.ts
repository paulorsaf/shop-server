export class ProductImageDeletedEvent {
    private readonly eventType = "PRODUCT_IMAGE_DELETED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly image: ProductImage,
        public readonly userId: string
    ){}
}

type ProductImage = {
    fileName: string;
    imageUrl: string
}