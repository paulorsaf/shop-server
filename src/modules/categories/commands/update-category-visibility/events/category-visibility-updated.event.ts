export class CategoryVisibilityUpdatedEvent {
  private readonly eventType = "CATEGORY_VISIBILITY_UPDATED_EVENT";
  constructor(
    public readonly companyId: string,
    public readonly userId: string,
    public readonly categoryId: string,
    public readonly isVisible: boolean
  ) {}
}