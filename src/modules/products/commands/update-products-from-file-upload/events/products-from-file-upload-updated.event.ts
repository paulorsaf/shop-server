import { ProductsFromFile } from "src/modules/products/types/products-from-file.type";

export class ProductsFromFileUploadUpdatedEvent {

  private readonly eventType = "PRODUCTS_FROM_FILE_UPLOAD_UPDATED_EVENT";
  
  constructor(
    public readonly companyId: string,
    public readonly userId: string,
    public readonly products: ProductsFromFile[]
  ) {}

}