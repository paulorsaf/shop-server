export class UpdateCompanyServiceTaxCommand {
    constructor(
        public readonly companyId: string,
        public readonly serviceTax: number,
        public readonly user: User
    ){}
}

type User = {
    companyId: string;
    id: string;
}