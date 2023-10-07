export class UpdateProductsFromFileUploadCommand {

    constructor(
        public readonly userId: string,
        public readonly companyId: string,
        public readonly filePath: string
    ){}

}