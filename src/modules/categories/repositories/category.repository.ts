import { Injectable } from '@nestjs/common';
import { Category } from '../entities/category';
import * as admin from 'firebase-admin';
import { format } from 'date-fns';

@Injectable()
export class CategoryRepository {

  constructor(
  ) {}

  async delete(id: string) {
    return admin.firestore()
      .collection('categories')
      .doc(id)
      .delete();
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
      createdAt: format(new Date(), 'yyy-MM-dd HH:mm:ss')
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
    const updatedAt = format(new Date(), 'yyy-MM-dd HH:mm:ss');

    return admin.firestore()
      .collection('categories')
      .doc(category.id)
      .update({
        name: category.name,
        updatedAt
      });
  }

}
