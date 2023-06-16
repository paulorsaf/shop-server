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
        snapshot.docs.map(d => {
          const category = d.data() as Category;
          return {
            ...category,
            id: d.id,
            isVisible: category.isVisible === undefined ? true : category.isVisible
          }
        })
      );
  }

  async findById(id: string) {
    return admin.firestore()
      .collection('categories')
      .doc(id)
      .get()
      .then(snapshot => {
        const category = snapshot.data() as Category;
        return new Category(
          snapshot.id,
          category.name,
          category.companyId,
          category.createdBy,
          category.createdAt,
          category.updatedAt,
          category.isVisible === undefined ? true : category.isVisible
        )
      });
  }

  async save(category: {companyId: string, createdBy: string, name: string}) {
    const save = {
      companyId: category.companyId,
      createdBy: category.createdBy,
      name: category.name,
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T"),
      isVibile: true
    }
    
    return admin.firestore()
      .collection('categories')
      .add(save)
      .then(response =>
        new Category(
          response.id,
          save.name,
          save.companyId,
          save.createdBy,
          save.createdAt,
          undefined,
          true
        )
      );
  }

  async update(category: {id: string, name: string}) {
    const updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T");

    return admin.firestore()
      .collection('categories')
      .doc(category.id)
      .update({
        name: category.name,
        updatedAt
      });
  }

  async updateVisibility(params: UpdateVisibility) {
    const updatedAt = format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T");
    return admin.firestore()
      .collection('categories')
      .doc(params.categoryId)
      .update({
        isVisible: params.isVisible,
        updatedAt
      })
  }

}

type UpdateVisibility = {
  categoryId: string;
  isVisible: boolean;
}