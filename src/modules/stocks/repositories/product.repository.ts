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
          totalStock: product.totalStock || 0
        }
      });
  }

  async updateStockAmount(update: UpdateProductStock) {
    return admin.firestore()
      .collection('products')
      .doc(update.productId)
      .update({
        totalStock: update.amount
      });
  }

}

type UpdateProductStock = {
  amount: number;
  productId: string;
}