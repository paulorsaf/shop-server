import { Injectable } from '@nestjs/common';
import { CategoryCreatedEvent } from '../create-category/events/category-created.event';
import { Category } from '../entities/category';

@Injectable()
export class CategoryRepository {

  addEvent(event: CategoryCreatedEvent) {
    console.log(event)
  }

  async save(category: Category) {
    console.log(new Category(null, category.name))
    return new Category("1", category.name);
  }

}
