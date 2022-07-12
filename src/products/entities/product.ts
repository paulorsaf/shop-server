export class Product {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly categoryId: string,
        public readonly companyId: string,
        public readonly createdBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ){}
}