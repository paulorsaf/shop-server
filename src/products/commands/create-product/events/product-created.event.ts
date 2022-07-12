import { CreateProductDTO } from "../dtos/create-product.dto";

export class ProductCreatedEvent {
  private readonly eventType = "PRODUCT_CREATED_EVENT";
  constructor(
    public readonly product: CreateProductDTO & {id: string},
    public readonly companyId: string,
    public readonly userId: string
  ) {}
}