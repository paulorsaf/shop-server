export class CreateProductDTO {
    constructor(
        public readonly name: string,
        public readonly categoryId: string,
        public readonly price: number,
        public readonly priceWithDiscount: number,
        public readonly weight: number
    ){}
}