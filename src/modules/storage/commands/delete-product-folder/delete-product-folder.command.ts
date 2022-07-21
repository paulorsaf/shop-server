export class DeleteProductFolderCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly deletedBy: string
    ){}
}