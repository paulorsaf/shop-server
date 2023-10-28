import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Stock, StockOption } from '../entities/stock';

@Injectable()
export class StockRepository {

  addStock(stock: Stock) {
    return admin.firestore()
      .collection('stocks')
      .add(JSON.parse(JSON.stringify(stock)))
      .then(r => r.id);
  }

  createStock(stock: Stock) {
    return admin.firestore()
      .collection('stocks')
      .doc(stock.id)
      .create(JSON.parse(JSON.stringify(stock)));
  }

  findById(stockId: string) {
    return admin.firestore()
      .collection('stocks')
      .doc(stockId)
      .get()
      .then(snapshot => {
        if (!snapshot.exists) {
          return null;
        }
        return <Stock> {
          ...snapshot.data(), id: snapshot.id
        };
      });
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

  findByProductAndCompany(productId: string, companyId: string) {
    return admin.firestore()
      .collection('stocks')
      .where('productId', '==', productId)
      .where('companyId', '==', companyId)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return [];
        }
        return <Stock[]> snapshot.docs.map(d => ({
          ...d.data(), id: d.id
        }));
      });
  }

  removeStock(stockId: string) {
    return admin.firestore()
      .collection('stocks')
      .doc(stockId)
      .delete();
  }

  getTotalStockByProduct(productId: string, companyId: string): Promise<number> {
    return this.findByProductAndCompany(productId, companyId).then(stock => {
      let total = 0;
      stock.forEach(s => total += s.quantity);
      return total;
    })
  }

  updateStockOption(update: UpdateStockOption) {
    return admin.firestore()
      .collection('stocks')
      .doc(update.stockId)
      .update(JSON.parse(JSON.stringify(update.stock)));
  }

}

type UpdateStockOption = {
  stockId: string;
  stock: {
    quantity: number,
    size: string,
    color: string
  };
}