export class UpdateProductDTO {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly categoryId: string,
        public readonly price: number,
        public readonly priceWithDiscount: number,
        public readonly description: string,
        public readonly weight: number
    ){}
}