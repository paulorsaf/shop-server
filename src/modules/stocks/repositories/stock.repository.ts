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

  async updateStockOption(update: UpdateStockOption) {
    const batch = admin.firestore().batch();
    
    this.removeOriginalStockOption(update.stockId, update.originalStockOption, batch);
    this.addNewStockOption(update.stockId, update.stockOption, batch);

    return await batch.commit();
  }

  private removeOriginalStockOption(
    stockId: string, stockOption: StockOption, batch: admin.firestore.WriteBatch
  ){
    const removeRef = admin.firestore()
      .collection('stocks')
      .doc(stockId);

    batch.update(removeRef, {
      stockOptions: admin.firestore.FieldValue.arrayRemove(
        JSON.parse(JSON.stringify(stockOption))
      )
    });
  }

  private addNewStockOption(
    stockId: string, stockOption: StockOption, batch: admin.firestore.WriteBatch
  ) {
    const updateRef = admin.firestore()
      .collection('stocks')
      .doc(stockId);

    batch.update(updateRef, {
      stockOptions: admin.firestore.FieldValue.arrayUnion(
        JSON.parse(JSON.stringify(stockOption))
      )
    });
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