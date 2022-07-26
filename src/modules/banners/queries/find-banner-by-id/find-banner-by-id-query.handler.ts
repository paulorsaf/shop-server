import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { BannerRepository } from "../../repositories/banner.repository";
import { FindBannerByIdQuery } from "./find-banner-by-id.query";

@QueryHandler(FindBannerByIdQuery)
export class FindBannerByIdQueryHandler implements IQueryHandler<FindBannerByIdQuery> {

    constructor(
        private bannerRepository: BannerRepository
    ){}

    async execute(query: FindBannerByIdQuery) {
        const banner = await this.bannerRepository.findById(query.bannerId);
        if (!banner) {
            throw new NotFoundException();
        }
        if (banner.companyId !== query.companyId) {
            throw new NotFoundException();
        }
        
        return banner;
    }

}