export class Product {
    constructor(
        public readonly id: string,
        public readonly companyId: string,
        public readonly images?: ProductImage[],
    ){}
}

export type ProductImage = {
    fileName: string;
    imageUrl: string
}