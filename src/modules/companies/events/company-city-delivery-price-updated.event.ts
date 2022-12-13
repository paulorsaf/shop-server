export class CompanyCityDeliveryPriceUpdatedEvent {
    private readonly eventType = "COMPANY_CITY_DELIVERY_PRICE_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly price: number,
        public readonly userId: string
    ){}
}