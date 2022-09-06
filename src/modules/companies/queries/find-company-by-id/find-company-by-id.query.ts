export class FindCompanyByIdQuery {
    constructor(
        public readonly companyId: string,
        public readonly user: User
    ){}
}

type User = {
    companyId: string;
    id: string;
}