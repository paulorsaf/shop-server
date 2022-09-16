import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DailyPurchasesSummary } from '../models/daily-purchases-summary.model';
import { Purchase } from '../models/purchase.model';

@Injectable()
export class PurchaseSummaryRepository {

    findByCompanyIdAndDate({companyId, date}: FindByCompanyIdAndDate): Promise<DailyPurchasesSummary> {
        return admin.firestore()
            .collection('purchase-summaries')
            .where('companyId', '==', companyId)
            .where('date', '==', date)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                const db = snapshot.docs[0];
                return <DailyPurchasesSummary> {
                    ...snapshot.docs[0].data(),
                    id: db.id
                };
            })
    }

    updateStatus({dailyPurchaseId, purchase}: UpdateStatus) {
        return admin.firestore()
            .collection('purchase-summaries')
            .doc(dailyPurchaseId)
            .update({
                [`purchases.${purchase.id}.reason`]: purchase.reason || "",
                [`purchases.${purchase.id}.status`]: purchase.status
            })
    }

}

type FindByCompanyIdAndDate = {
    companyId: string,
    date: string
}

type UpdateStatus = {
    dailyPurchaseId: string;
    purchase: Purchase
}