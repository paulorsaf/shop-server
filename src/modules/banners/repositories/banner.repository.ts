import { Injectable } from "@nestjs/common";

@Injectable()
export class BannerRepository {

    findByCompany(companyId: string) {
        return Promise.resolve([]);
    }

}