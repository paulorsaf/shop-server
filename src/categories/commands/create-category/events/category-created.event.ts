import { Category, CategoryUser } from "src/categories/entities/category";

export class CategoryCreatedEvent {
  private readonly eventType = "CATEGORY_CREATED_EVENT";
  constructor(
    public readonly category: Category,
    public readonly createdAt: string
  ) {}
}