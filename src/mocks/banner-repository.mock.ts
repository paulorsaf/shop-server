export class BannerRepositoryMock {

    response: any;

    findByCompany(params: any) {
        return this.response;
    }

}