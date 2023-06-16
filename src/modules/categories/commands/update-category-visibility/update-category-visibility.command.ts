export class UpdateCategoryVisibilityCommand {

    constructor(
        public readonly userId: string,
        public readonly companyId: string,
        public readonly categoryId: string
    ){}

}