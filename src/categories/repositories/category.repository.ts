import { Injectable } from '@nestjs/common';
import { Category, SaveCategory } from '../entities/category';
import * as admin from 'firebase-admin';
import { CategoryCreatedEvent } from '../commands/create-category/events/category-created.event';

@Injectable()
export class CategoryRepository {

  constructor(
  ) {}

  addEvent(event: CategoryCreatedEvent) {
    admin.firestore().collection('events').add(
      JSON.parse(JSON.stringify(event))
    );
  }

  async findByCompany(companyId: string) {
    return admin.firestore()
      .collection('categories')
      .where('companyId', '==', companyId)
      .get()
      .then(snapshot =>
        snapshot.docs.map(d => <Category> {
          ...d.data(),
          id: d.id
        })
      );
  }

  async save(category: Category) {
    const saveCategory = new SaveCategory(
      category.name, category.createdBy, category.companyId
    );
    
    return admin.firestore().collection('categories')
      .add(JSON.parse(JSON.stringify(saveCategory)))
      .then(response =>
        new Category(
          response.id, category.name, category.createdBy, category.companyId
        )
      );
  }

}
