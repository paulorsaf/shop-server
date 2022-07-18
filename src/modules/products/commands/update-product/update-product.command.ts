import { UpdateProductDTO } from "./dtos/update-product.dto";

export class UpdateProductCommand {

    constructor(
        public readonly product: UpdateProductDTO,
        public readonly companyId: string,
        public readonly updatedBy: string
    ) {}

}