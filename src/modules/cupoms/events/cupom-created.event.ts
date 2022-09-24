import { Cupom } from "../models/cupom.model"

export class CupomCreatedEvent {

    private readonly eventType = "CUPOM_CREATED_EVENT";

    constructor(
        public readonly companyId: string,
        public readonly cupom: Cupom & {id: string},
        public readonly userId: string
    ){}

}