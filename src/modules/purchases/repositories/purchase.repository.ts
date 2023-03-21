import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { PurchaseSummary } from "../model/purchase-summary.model";
import { Purchase } from '../model/purchase.model';
import { PurchaseProduct } from '../model/purchase.types';
import { PurchasePrice } from 'shop-purchase-price';
import { Company } from '../../companies/models/company.model';

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
            .then(async snapshot => {
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
                    products: db.products,
                    productsCancelled: db.productsCancelled,
                    status: db.status,
                    user: {
                        email: db.user.email,
                        id: db.user.id,
                        name: await this.findUserName(db.user.id)
                    }
                })
            })
    }
    
    findById(id: string): Promise<Purchase> {
        return admin.firestore()
            .collection('purchases')
            .doc(id)
            .get()
            .then(async snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const db = snapshot.data();
                return new Purchase({
                    address: db.address,
                    companyId: db.companyId,
                    createdAt: db.createdAt,
                    hasBeenSentToSystem: db.hasBeenSentToSystem,
                    id: snapshot.id,
                    payment: db.payment,
                    price: db.price,
                    productNotes: db.productNotes,
                    products: db.products,
                    productsCancelled: db.productsCancelled,
                    status: db.status,
                    user: {
                        email: db.user.email,
                        id: db.user.id,
                        name: await this.findUserName(db.user.id)
                    }
                })
            })
    }

    private async findUserName(userId: string): Promise<string> {
        return admin.firestore()
            .collection('users')
            .doc(userId)
            .get()
            .then(snapshot => {
                if (snapshot.exists) {
                    return snapshot.data().name;
                }
                return "";
            });
    }

    setAsSentToSystem(purchaseId: string, dataSentToInternalSystem: any) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchaseId)
            .update({
                dataSentToInternalSystem: JSON.parse(JSON.stringify(dataSentToInternalSystem)),
                hasBeenSentToSystem: true
            })
    }

    updateProductAmount(update: UpdateProductAmount) {
        return admin.firestore()
            .collection('purchases')
            .doc(update.purchase.id)
            .update({
                products: admin.firestore.FieldValue.arrayRemove(update.purchaseProduct)
            }).then(() => {
                return admin.firestore()
                    .collection('purchases')
                    .doc(update.purchase.id)
                    .update({
                        products: admin.firestore.FieldValue.arrayUnion({
                            ...update.purchaseProduct,
                            amount: update.amount
                        })
                    })
            })
    }

    updatePurchasePrice(purchase: Purchase) {
        return admin.firestore()
            .collection('companies')
            .doc(purchase.companyId)
            .get()
            .then(async snapshot => {
                if (snapshot.exists) {
                    const company = snapshot.data() as Company;
                    const discount = await this.findDiscount(purchase);
                    const price = await this.calculatePurchasePrice(purchase, company, discount);

                    return admin.firestore()
                        .collection('purchases')
                        .doc(purchase.id)
                        .update({price});
                }
            });
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

    cancelPurchaseProduct(cancel: CancelPurchaseProduct) {
        return admin.firestore()
            .collection('purchases')
            .doc(cancel.purchase.id)
            .update({
                products: admin.firestore.FieldValue.arrayRemove(cancel.purchaseProduct)
            }).then(() => {
                return admin.firestore()
                    .collection('purchases')
                    .doc(cancel.purchase.id)
                    .update({
                        productsCancelled: admin.firestore.FieldValue.arrayUnion(
                            cancel.purchaseProduct
                        )
                    })
            })
    }

    private findDiscount(purchase: Purchase) {
        if (!purchase.payment?.cupom) {
            return 0;
        }
        return admin.firestore()
            .collection('cupoms')
            .where('companyId', '==', purchase.companyId)
            .where('cupom', '==', purchase.payment.cupom)
            .get()
            .then(async snapshot => {
                if (snapshot.empty) {
                    return 0;
                }
                const cupom = snapshot.docs[0].data() as {discount: number};
                return cupom.discount;
            });
    }

    private async calculatePurchasePrice(purchase: Purchase, company: Company, discount: number) {
        return await new PurchasePrice({
            addresses: {
                destination: purchase.address?.zipCode,
                origin: company.address.zipCode
            },
            discount,
            innerCityDeliveryPrice: company.cityDeliveryPrice,
            originCityName: company.address.city,
            paymentFee: purchase.payment?.type === 'CREDIT_CARD' ? {
                percentage: company.payment?.creditCard?.fee?.percentage || 0,
                value: company.payment?.creditCard?.fee?.value || 0
            } : null,
            products: purchase.products.map(p => ({
                amount: p.amount,
                price: p.price,
                priceWithDiscount: p.priceWithDiscount,
                weight: p.weight
            }))
        }).calculatePrice();
    }

}

type Find = {
    companyId: string;
}

type FindByIdAndCompany = {
    companyId: string;
    id: string;
}

type UpdateProductAmount = {
    amount: number;
    purchaseProduct: PurchaseProduct;
    purchase: Purchase;
}

type CancelPurchaseProduct = {
    purchaseProduct: PurchaseProduct;
    purchase: Purchase;
}

type UpdateStatus = {
    id: string;
    status: string;
    reason?: string;
}