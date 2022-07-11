import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category';
import * as admin from 'firebase-admin';
import { CategoryCreatedEvent } from '../commands/create-category/events/category-created.event';
import { CategoryUpdatedEvent } from '../commands/update-category/events/category-updated.event';

@Injectable()
export class CategoryRepository {

  constructor(
  ) {}

  addEvent(event: CategoryCreatedEvent | CategoryUpdatedEvent) {
    admin.firestore().collection('events').add(
      JSON.parse(JSON.stringify({
        ...event,
        timestamp: new Date().toISOString()
      }))
    );
  }

  async findByCompany(companyId: string) {
    return admin.firestore()
      .collection('categories')
      .where('companyId', '==', companyId)
      .orderBy('name', 'asc')
      .get()
      .then(snapshot =>
        snapshot.docs.map(d => <Category> {
          ...d.data(),
          id: d.id
        })
      );
  }

  async findById(id: string) {
    return admin.firestore()
      .collection('categories')
      .doc(id)
      .get()
      .then(snapshot =>
        <Category> snapshot.data()
      );
  }

  async save(category: {companyId: string, createdBy: string, name: string}) {
    const save = {
      companyId: category.companyId,
      createdBy: category.createdBy,
      name: category.name,
      createdAt: new Date().toISOString()
    }
    
    return admin.firestore()
      .collection('categories')
      .add(save)
      .then(response =>
        new Category(
          response.id, save.name, save.companyId, save.createdBy, save.createdAt, null
        )
      );
  }

  async update(category: {id: string, name: string}) {
    const updatedAt = new Date().toISOString();

    return admin.firestore()
      .collection('categories')
      .doc(category.id)
      .update({
        name: category.name,
        updatedAt
      });
  }

}
