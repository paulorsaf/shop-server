export class ImageFileDeletedEvent {
    private readonly eventType = "IMAGE_FILE_DELETED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly productId: string,
        public readonly fileName: string,
        public readonly userId: string
    ){}
}