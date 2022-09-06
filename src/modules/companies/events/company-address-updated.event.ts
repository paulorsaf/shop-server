import { Address } from "../models/address.model";

export class CompanyAddressUpdatedEvent {
    private readonly eventType = "COMPANY_ADDRESS_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly address: Address,
        public readonly userId: string
    ){}
}