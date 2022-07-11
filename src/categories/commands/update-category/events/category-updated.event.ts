export class CategoryUpdatedEvent {
  private readonly eventType = "CATEGORY_UPDATED_EVENT";
  constructor(
    public readonly category: Category,
    public readonly companyId: string,
    public readonly updatedBy: string
  ) {}
}

type Category = {
  id: string,
  name: string
}