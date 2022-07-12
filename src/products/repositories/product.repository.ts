import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreateProductDTO } from '../commands/create-product/dtos/create-product.dto';
import { Product } from '../entities/product';

@Injectable()
export class ProductRepository {

  constructor(
  ) {}

  async findByCompany(companyId: string) {
    return admin.firestore()
      .collection('products')
      .where('companyId', '==', companyId)
      .orderBy('name', 'asc')
      .get()
      .then(snapshot =>
        snapshot.docs.map(d => <Product> {
          ...d.data(),
          id: d.id
        })
      );
  }

  async findById(productId: string) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .get()
      .then(snapshot => (<Product> {
        ...snapshot.data(),
        id: snapshot.id
      }));
  }

  async save(product: CreateProductDTO & {companyId: string, createdBy: string}):
    Promise<{id: string}> {
    return admin.firestore()
      .collection('products')
      .add({...product, createdAt: new Date().toISOString()})
      .then(snapshot => {
        return {id: snapshot.id}
      })
  }

}
