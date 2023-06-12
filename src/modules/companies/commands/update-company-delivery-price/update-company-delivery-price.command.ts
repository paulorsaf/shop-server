export class UpdateCompanyDeliveryPriceCommand {
    constructor(
        public readonly companyId: string,
        public readonly price: number,
        public readonly hasDeliveryByMail: boolean,
        public readonly userId: string
    ){}
}