import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PurchaseSummaryDTO } from '../dtos/purchase-summary.dto';
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

    find({companyId, from, until}: FindDaily): Promise<PurchaseSummaryDTO[]> {
        return admin.firestore()
            .collection('purchase-summaries')
            .where('companyId', '==', companyId)
            .where('date', '>=', from)
            .where('date', '<=', until)
            .orderBy('date', 'desc')
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return [];
                }
                let purchases: PurchaseSummaryDTO[] = [];
                snapshot.docs.forEach(d => {
                    const db = <DailyPurchasesSummary> d.data();
                    for (let key in db.purchases) {
                        const purchase = db.purchases[key];
                        let mapProducts = {};
                        purchase.products.forEach(p => {
                            if (!mapProducts[p.id]) {
                                mapProducts[p.id] = p;
                            } else {
                                mapProducts[p.id].amount += p.amount;
                                mapProducts[p.id].price += p.price;
                                mapProducts[p.id].priceWithDiscount += p.priceWithDiscount;
                            }
                        })

                        let products = [];
                        for (let productKey in mapProducts) {
                            products.push(mapProducts[productKey]);
                        }

                        purchases.push(new PurchaseSummaryDTO({
                            id: key,
                            address: purchase.address,
                            createdAt: purchase.createdAt,
                            payment: purchase.payment,
                            price: purchase.price,
                            products,
                            status: purchase.status,
                            user: purchase.user
                        }))
                    }
                })
                return purchases;
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

type FindDaily = {
    companyId: string,
    from: string,
    until: string
}

type UpdateStatus = {
    dailyPurchaseId: string;
    purchase: Purchase
}