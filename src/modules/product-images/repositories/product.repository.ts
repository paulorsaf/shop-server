import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Product } from '../entities/product';

@Injectable()
export class ProductRepository {

  constructor(
  ) {}

  async findById(productId: string): Promise<Product> {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .get()
      .then(snapshot => {
        if (!snapshot.exists) {
          return null;
        }
        return <Product> {
          companyId: snapshot.data().companyId,
          id: snapshot.id
        }
      });
  }

}
