import { Address } from "../../models/address.model";

export class UpdateCompanyAddressCommand {
    constructor(
        public readonly companyId: string,
        public readonly address: Address,
        public readonly user: User
    ){}
}

type User = {
    companyId: string;
    id: string;
}