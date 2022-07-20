import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Stock, StockOption } from '../entities/stock';

@Injectable()
export class StockRepository {

  async addStockOption(stockId: string, stockOption: StockOption) {
    return admin.firestore()
      .collection('stocks')
      .doc(stockId)
      .update({
        stockOptions: admin.firestore.FieldValue.arrayUnion(
          JSON.parse(JSON.stringify(stockOption))
        )
      });
  }

  async createStock(stock: Stock) {
    return admin.firestore()
      .collection('stocks')
      .doc(stock.id)
      .create(JSON.parse(JSON.stringify(stock)));
  }

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

  async removeStockOption(remove: RemoveStockOption) {
    return admin.firestore()
      .collection('stocks')
      .doc(remove.stockId)
      .update({
        stockOptions: admin.firestore.FieldValue.arrayRemove(
          JSON.parse(JSON.stringify(remove.stockOption))
        )
      });
  }

  async removeStock(stockId: string) {
    return admin.firestore()
      .collection('stocks')
      .doc(stockId)
      .delete();
  }

}

type RemoveStockOption = {
  stockId: string;
  stockOption: StockOption;
}