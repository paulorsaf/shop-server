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
        if (category.companyId !== query.companyId) {
            throw new NotFoundException('Categoria nao encontrada');
        }
        return category;
    }

}