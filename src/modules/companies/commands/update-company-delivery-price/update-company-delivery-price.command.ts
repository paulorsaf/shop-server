export class UpdateCompanyDeliveryPriceCommand {
    constructor(
        public readonly companyId: string,
        public readonly price: number,
        public readonly userId: string
    ){}
}