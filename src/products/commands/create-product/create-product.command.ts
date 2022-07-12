import { CreateProductDTO } from "./dtos/create-product.dto";

export class CreateProductCommand {
    constructor(
        public readonly product: CreateProductDTO,
        public readonly companyId: string,
        public readonly createdBy: string
    ){}
}