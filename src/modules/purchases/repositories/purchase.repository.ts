import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Purchase } from "../model/purchase.model";

@Injectable()
export class PurchaseRepository {

    find(purchase: Purchase) {
        return admin.firestore()
            .collection('purchases')
            .where('companyId', '==', purchase.companyId)
            .where('userId', '==', purchase.userId)
            .get()
            .then(snapshot => {
                return snapshot.docs.map(s => {
                    const purchaseDb = s.data();
                    return new Purchase({
                        companyId: purchaseDb.companyId,
                        userId: purchaseDb.userId
                    })
                })
            })
    }

}