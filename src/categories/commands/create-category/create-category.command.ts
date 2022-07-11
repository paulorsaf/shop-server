import { CategoryUser } from "src/categories/entities/category";

export class CreateCategoryCommand {
    constructor(
        public readonly name: string,
        public readonly companyId: string,
        public readonly user: CategoryUser
    ) {}
}