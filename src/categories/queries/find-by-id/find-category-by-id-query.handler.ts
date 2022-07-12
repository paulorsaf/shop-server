import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Category } from "../../entities/category";
import { CategoryRepository } from "../../repositories/category.repository";
import { FindCategoryByIdQuery } from "./find-category-by-id.query";

@QueryHandler(FindCategoryByIdQuery)
export class FindCategoryByIdQueryHandler implements IQueryHandler<FindCategoryByIdQuery> {
  
    constructor(
        private categoryRepository: CategoryRepository
    ) {}

    async execute(query: FindCategoryByIdQuery): Promise<Category> {
        const category = await this.categoryRepository.findById(query.categoryId);
        if (!this.belongsToCompany(category, query.companyId)) {
            return null;
        }
        return category;
    }

    private belongsToCompany(category: Category, companyId: string) {
        if (!category) {
            return false;
        }
        if (category.companyId !== companyId) {
            return false;
        }
        return true;
    }

}