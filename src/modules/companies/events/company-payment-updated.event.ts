import { Payment } from "../models/payment.model";

export class CompanyPaymentUpdatedEvent {
    private readonly eventType = "COMPANY_PAYMENT_UPDATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly payment: Payment,
        public readonly userId: string
    ){}
}