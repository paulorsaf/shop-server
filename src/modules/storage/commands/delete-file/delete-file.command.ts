export class DeleteFileCommand {
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly fileName: string,
        public readonly deletedBy: string
    ){}
}