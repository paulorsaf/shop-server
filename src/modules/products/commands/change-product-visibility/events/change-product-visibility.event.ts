export class ProductVisibilityChangedEvent {

  private readonly eventType = "PRODUCT_VISIBILITY_CHANGED_EVENT";
  
  constructor(
    public readonly companyId: string,
    public readonly userId: string,
    public readonly isVisible: boolean
  ) {}

}