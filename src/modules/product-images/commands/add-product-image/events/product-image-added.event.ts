export class ProductImageAddedEvent {
    private readonly eventType = "PRODUCT_IMAGE_ADDED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly image: Image,
        public readonly userId: string
    ) {}
}

type Image = {
    fileName: string;
    imageUrl: string;
}