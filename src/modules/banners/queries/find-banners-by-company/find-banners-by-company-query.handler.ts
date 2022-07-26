import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Banner } from "../../entities/banner";
import { BannerRepository } from "../../repositories/banner.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { BannerDTO } from "./dtos/banner.dto";
import { FindBannersByCompanyQuery } from "./find-banners-by-company.query";

@QueryHandler(FindBannersByCompanyQuery)
export class FindBannersByCompanyQueryHandler implements IQueryHandler<FindBannersByCompanyQuery> {

    constructor(
        private bannerRepository: BannerRepository,
        private productRepository: ProductRepository
    ){}

    async execute(query: FindBannersByCompanyQuery) {
        const banners = await this.bannerRepository.findByCompany(query.companyId);
        return await this.createBannerDTO(banners);
    }

    async createBannerDTO(banners: Banner[]) {
        return Promise.all(banners.map(banner => {
            return this.productRepository.findById(banner.productId)
        })).then(results => {
            return results.map((r, index) => {
                return new BannerDTO(banners[index].id, r);
            })
        })
    }

}