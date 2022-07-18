export class CreateCategoryCommand {
    constructor(
        public readonly name: string,
        public readonly companyId: string,
        public readonly createdBy: string
    ) {}
}