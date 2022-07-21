export class AddProductImageCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly filePath: string,
        public readonly createdBy: string
    ){}
}