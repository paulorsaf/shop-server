import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Stock, StockOption } from '../entities/stock';

@Injectable()
export class StockRepository {

  addStockOption(stockId: string, stockOption: StockOption) {
    return admin.firestore()
      .collection('stocks')
      .doc(stockId)
      .update({
        stockOptions: admin.firestore.FieldValue.arrayUnion(
          JSON.parse(JSON.stringify(stockOption))
        )
      });
  }

  createStock(stock: Stock) {
    return admin.firestore()
      .collection('stocks')
      .doc(stock.id)
      .create(JSON.parse(JSON.stringify(stock)));
  }

  findByProduct(productId: string) {
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

  removeStockOption(remove: RemoveStockOption) {
    return admin.firestore()
      .collection('stocks')
      .doc(remove.stockId)
      .update({
        stockOptions: admin.firestore.FieldValue.arrayRemove(
          JSON.parse(JSON.stringify(remove.stockOption))
        )
      });
  }

  removeStock(stockId: string) {
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

type UpdateStockOption = {
  stockId: string;
  originalStockOption: StockOption;
  stockOption: StockOption;
}