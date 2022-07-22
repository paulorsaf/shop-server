import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BannerRepository } from "../../repositories/banner.repository";
import { FindBannersByCompanyQuery } from "./find-banners-by-company.query";

@QueryHandler(FindBannersByCompanyQuery)
export class FindBannersByCompanyQueryHandler implements IQueryHandler<FindBannersByCompanyQuery> {

    constructor(
        private bannerRepository: BannerRepository
    ){}

    async execute(query: FindBannersByCompanyQuery) {
        return await this.bannerRepository.findByCompany(query.companyId);
    }

}