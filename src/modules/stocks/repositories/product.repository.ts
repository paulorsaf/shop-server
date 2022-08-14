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
        const product = snapshot.data();
        return {
          companyId: product.companyId,
          stock: product.stock || 0
        }
      });
  }

}