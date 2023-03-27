export class UpdateCompanyServiceTaxCommand {
    constructor(
        public readonly companyId: string,
        public readonly serviceTax: number,
        public readonly userId: string
    ){}
}