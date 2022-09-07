export class UpdateCompanyLogoCommand {
    constructor(
        public readonly companyId: string,
        public readonly filePath: string,
        public readonly user: User
    ){}
}

type User = {
    companyId: string;
    id: string;
}