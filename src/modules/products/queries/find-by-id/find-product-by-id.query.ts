export class FindProductByIdQuery {
    constructor(
        public readonly companyId: string,
        public readonly productId: string
    ){}
}