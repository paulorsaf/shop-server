import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Stock, StockOption } from '../entities/stock';

@Injectable()
export class StockRepository {

  constructor(
  ) {}

  async findByProduct(productId: string) {
    return admin.firestore()
      .collection('stocks')
      .where('productId', '==', productId)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return null;
        }
        return <Stock> snapshot.docs[0].data();
      });
  }

}
