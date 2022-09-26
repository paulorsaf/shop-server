import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Cupom } from "../models/cupom.model";
import { format } from 'date-fns';

@Injectable()
export class CupomRepository {

    create(cupom: Cupom): Promise<string> {
        return admin.firestore()
            .collection('cupoms')
            .add(JSON.parse(JSON.stringify({
                ...cupom,
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSSS')
            })))
            .then(snapshot => snapshot.id);
    }

    find(companyId: string): Promise<Cupom[]> {
        return admin.firestore()
            .collection('cupoms')
            .where('companyId', '==', companyId)
            .orderBy('createdAt', 'desc')
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return [];
                }
                return snapshot.docs.map(d => {
                    const data = d.data();
                    return {
                        amountLeft: data.amountLeft,
                        cupom: data.cupom,
                        discount: data.discount,
                        expireDate: data.expireDate,
                        id: d.id
                    } as Cupom;
                })
            })
    }

    findByCupom({companyId, cupom}: Find): Promise<Cupom> {
        return admin.firestore()
            .collection('cupoms')
            .where('companyId', '==', companyId)
            .where('cupom', '==', cupom)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                const doc = snapshot.docs[0];
                const data = doc.data();
                return {
                    amountLeft: data.amountLeft,
                    cupom: data.cupom,
                    discount: data.discount,
                    expireDate: data.expireDate,
                    id: doc.id
                } as Cupom;
            })
    }

}

type Find = {
    companyId: string;
    cupom: string;
}