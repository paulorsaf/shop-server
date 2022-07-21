export class ProductFolderDeletedEvent {
    private readonly eventType = "PRODUCT_FOLDER_DELETED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly userId: string
    ){}
}