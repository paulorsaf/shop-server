import { PaymentDTO } from "../../dtos/payment.dto";

export class UpdateCompanyPaymentCommand {
    constructor(
        public readonly companyId: string,
        public readonly payment: PaymentDTO,
        public readonly user: User
    ){}
}

type User = {
    companyId: string;
    id: string;
}