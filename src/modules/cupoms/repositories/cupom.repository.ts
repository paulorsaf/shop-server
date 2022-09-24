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
                        expireDate: data.expireDate,
                        id: d.id
                    } as Cupom;
                })
            })
    }

}