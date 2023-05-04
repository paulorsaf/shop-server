export class ChangeProductVisibilityCommand {

    constructor(
        public readonly companyId: string,
        public readonly userId: string,
        public readonly productId: string
    ) {}

}