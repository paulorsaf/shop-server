export class CategoryCreatedEvent {
  private eventType = "CATEGORY_CREATED_EVENT";
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: string,
    public readonly createdBy: string
  ) {}
}