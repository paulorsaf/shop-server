export class UpdateCompanyCommand {
    constructor(
        public readonly companyId: string,
        public readonly company: Company,
        public readonly user: User
    ){}
}

type Company = {
    name: string;
}
type User = {
    companyId: string;
    id: string;
}