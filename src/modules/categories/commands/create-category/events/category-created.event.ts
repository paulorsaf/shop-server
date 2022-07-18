export class CategoryCreatedEvent {
  private readonly eventType = "CATEGORY_CREATED_EVENT";
  constructor(
    public readonly category: Category,
    public readonly companyId: string,
    public readonly userId: string
  ) {}
}

type Category = {
  id: string,
  name: string
}