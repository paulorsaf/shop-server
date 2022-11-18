import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { PurchaseSummary } from "../model/purchase-summary.model";
import { Purchase } from '../model/purchase.model';

@Injectable()
export class PurchaseRepository {

    find(query: Find) {
        return admin.firestore()
            .collection('purchases')
            .where('companyId', '==', query.companyId)
            .orderBy('createdAt', 'desc')
            .get()
            .then(snapshot => {
                return snapshot.docs.map(s => {
                    const db = s.data();
                    return new PurchaseSummary({
                        address: db.address,
                        companyId: db.companyId,
                        createdAt: db.createdAt,
                        id: s.id,
                        payment: db.payment,
                        products: db.products.map(p => ({
                            amount: p.amount,
                            price: p.price,
                            priceWithDiscount: p.priceWithDiscount
                        })),
                        status: db.status,
                        totalWithPaymentFee: db.price?.totalWithPaymentFee || 0,
                        user: {
                            email: db.user.email,
                            id: db.user.id
                        }
                    })
                })
            })
    }

    findByIdAndCompany(query: FindByIdAndCompany): Promise<Purchase> {
        return admin.firestore()
            .collection('purchases')
            .doc(query.id)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const db = snapshot.data();
                if (db.companyId !== query.companyId) {
                    return null;
                }
                return new Purchase({
                    address: db.address,
                    companyId: db.companyId,
                    createdAt: db.createdAt,
                    hasBeenSentToSystem: db.hasBeenSentToSystem,
                    id: snapshot.id,
                    payment: db.payment,
                    price: db.price,
                    productNotes: db.productNotes,
                    products: db.products.map(p => ({
                        id: p.id,
                        amount: p.amount,
                        name: p.name,
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
    }

    updateStatus(purchase: UpdateStatus) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchase.id)
            .update(JSON.parse(JSON.stringify({
                reason: purchase.reason || "",
                status: purchase.status
            })))
    }

}

type Find = {
    companyId: string;
}

type FindByIdAndCompany = {
    companyId: string;
    id: string;
}

type UpdateStatus = {
    id: string;
    status: string;
    reason?: string;
}