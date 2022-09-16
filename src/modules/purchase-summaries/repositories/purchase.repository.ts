import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Purchase } from '../models/purchase.model';

@Injectable()
export class PurchaseRepository {

    findByIdAndCompanyId({companyId, id}: FindByCompanyAndUser): Promise<Purchase> {
        return admin.firestore()
            .collection('purchases')
            .doc(id)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const db = snapshot.data();
                if (db.companyId !== companyId) {
                    return null;
                }
                return this.createPurchaseModel(snapshot.id, db);
            })
    }

    private createPurchaseModel(id: string, data: admin.firestore.DocumentData) {
        return new Purchase({
            id: id,
            createdAt: data.createdAt,
            reason: data.reason,
            status: data.status
        })
    }

}

type FindByCompanyAndUser = {
    companyId: string;
    id: string;
}