import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Purchase } from "../model/purchase.model";

@Injectable()
export class PurchaseRepository {

    find(purchase: Purchase) {
        return admin.firestore()
            .collection('purchases')
            .where('companyId', '==', purchase.companyId)
            .get()
            .then(snapshot => {
                return snapshot.docs.map(s => {
                    const db = s.data();
                    return new Purchase({
                        companyId: db.companyId,
                        createdAt: db.createdAt,
                        payment: db.payment ? {
                            error: db.payment.error,
                            receiptUrl: db.payment.receiptUrl,
                            type: db.payment.type
                        } : null,
                        products: db.products.map(p => ({
                            amount: p.amount,
                            price: p.price,
                            priceWithDiscount: p.priceWithDiscount
                        })),
                        status: db.status,
                        user: {
                            email: db.user.email,
                            id: db.user.id
                        }
                    })
                })
            })
    }

}