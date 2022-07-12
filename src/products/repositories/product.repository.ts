import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
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

}
