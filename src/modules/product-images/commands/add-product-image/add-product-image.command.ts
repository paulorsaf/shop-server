export class AddProductImageCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly image: Express.Multer.File,
        public readonly createdBy: string
    ){}
}