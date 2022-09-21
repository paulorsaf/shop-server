import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClientRepository } from "../../repositories/client.repository";
import { FindClientsByCompanyQuery } from "./find-clients-by-company.query";

@QueryHandler(FindClientsByCompanyQuery)
export class FindClientsByCompanyQueryHandler implements IQueryHandler<FindClientsByCompanyQuery> {
    
    constructor(
        private clientRepository: ClientRepository
    ){}

    async execute(query: FindClientsByCompanyQuery) {
        return this.clientRepository.findByCompany(query.companyId);
    }

}