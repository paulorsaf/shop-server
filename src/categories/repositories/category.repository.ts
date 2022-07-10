import { Injectable } from '@nestjs/common';
import { CategoryCreatedEvent } from '../create-category/events/category-created.event';
import { Category } from '../entities/category';
import * as admin from 'firebase-admin';

@Injectable()
export class CategoryRepository {

  constructor(
  ) {}

  addEvent(event: CategoryCreatedEvent) {
    admin.firestore().collection('events').add(JSON.parse(JSON.stringify(event)));
  }

  async save(category: Category) {
    console.log(new Category(null, category.name))
    return new Category("1", category.name);
  }

}
