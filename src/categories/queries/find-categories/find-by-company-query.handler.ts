import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Category } from "../../entities/category";
import { CategoryRepository } from "../../repositories/category.repository";
import { FindByCompanyQuery } from "./find-by-company.query";

@QueryHandler(FindByCompanyQuery)
export class FindByCompanyQueryHandler implements IQueryHandler<FindByCompanyQuery> {
  
    constructor(
        private categoryRepository: CategoryRepository
    ) {}

    async execute(query: FindByCompanyQuery): Promise<Category[]> {
        return this.categoryRepository.findByCompany(query.companyId);
    }

}