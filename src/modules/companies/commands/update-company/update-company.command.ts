import { CompanyDetailsDTO } from "../../dtos/company-details.dto"

export class UpdateCompanyCommand {
    constructor(
        public readonly companyId: string,
        public readonly company: CompanyDetailsDTO,
        public readonly user: User
    ){}
}

type User = {
    companyId: string;
    id: string;
}