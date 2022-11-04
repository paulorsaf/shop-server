export class UpdateStockByCompanyCommand {
    constructor(
        public readonly companyId: string,
        public readonly updatedBy: string
    ){}
}