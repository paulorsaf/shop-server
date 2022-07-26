import { BannerProduct } from "../../../entities/banner-product";

export class BannerDTO {
    constructor(
        public readonly id: string,
        public readonly product: BannerProduct
    ){}
}