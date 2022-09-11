import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Purchase } from '../model/purchase.model';
import { PurchaseProduct } from '../model/purchase-product.model';
import { PurchaseProductStock } from '../model/purchase-product-stock.model';
import { Company } from '../model/company.model';

@Injectable()
export class PurchaseRepository {

    findByIdAndCompanyId({companyId, purchaseId}: FindByCompanyAndId): Promise<Purchase> {
        return this.findPurchases({companyId, purchaseId}).then(purchaseDb => {
            return this.findCompany(companyId).then(companyDb => {
                return new Purchase({
                    address: purchaseDb.address,
                    company: new Company({
                        email: companyDb.email,
                        name: companyDb.name
                    }),
                    payment: purchaseDb.payment,
                    price: purchaseDb.price,
                    products: purchaseDb.products.map(p =>
                        new PurchaseProduct({
                            amount: p.amount,
                            name: p.name,
                            price: p.price,
                            priceWithDiscount: p.priceWithDiscount,
                            stock: p.stock ? new PurchaseProductStock({
                                color: p.stock.color,
                                size: p.stock.size
                            }) : null
                        })
                    ),
                    reason: purchaseDb.reason,
                    status: purchaseDb.status,
                    user: {
                        email: purchaseDb.user.email
                    }
                });
            })
        });
    }

    private findPurchases({companyId, purchaseId}: FindByCompanyAndId) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchaseId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const db = snapshot.data();
                if (db.companyId !== companyId) {
                    return null;
                }
                return db;
            });
    }

    private findCompany(companyId: string) {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                return snapshot.data();
            });
    }

}

type FindByCompanyAndId = {
    companyId: string;
    purchaseId: string;
}