export class UpdateCompanyAboutUsCommand {
    constructor(
        public readonly companyId: string,
        public readonly html: string,
        public readonly user: User
    ){}
}

type User = {
    companyId: string;
    id: string;
}