import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CupomRepository } from "../../repositories/cupom.repository";
import { FindCupomsByCompanyQuery } from "./find-cupoms-by-company.query";

@QueryHandler(FindCupomsByCompanyQuery)
export class FindCupomsByCompanyQueryHandler implements IQueryHandler<FindCupomsByCompanyQuery> {

    constructor(
        private cupomRepository: CupomRepository
    ){}

    async execute(query: FindCupomsByCompanyQuery) {
        return this.cupomRepository.find(query.companyId);
    }

}