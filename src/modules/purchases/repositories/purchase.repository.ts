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
            .get()
            .then(snapshot => {
                return snapshot.docs.map(s => {
                    const db = s.data();
                    return new PurchaseSummary({
                        companyId: db.companyId,
                        createdAt: db.createdAt,
                        id: s.id,
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
                    id: snapshot.id,
                    payment: db.payment ? {
                        error: db.payment.error,
                        receiptUrl: db.payment.receiptUrl,
                        type: db.payment.type
                    } : null,
                    products: db.products.map(p => ({
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

    updateStatus(purchase: Purchase) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchase.id)
            .update({
                status: purchase.getStatus()
            })
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
}