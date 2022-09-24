import { CreateCupomDTO } from "../../dtos/create-cupom.dto";

export class CreateCupomCommand {
    constructor(
        public readonly companyId: string,
        public readonly cupom: CreateCupomDTO,
        public readonly userId: string
    ){}
}