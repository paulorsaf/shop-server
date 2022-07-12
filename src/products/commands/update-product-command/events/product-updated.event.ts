import { UpdateProductDTO } from "../dtos/update-product.dto";

export class ProductUpdatedEvent {
    private readonly eventType = "PRODUCT_UPDATED_EVENT";
    constructor(
      public readonly product: UpdateProductDTO,
      public readonly companyId: string,
      public readonly userId: string
    ) {}
}