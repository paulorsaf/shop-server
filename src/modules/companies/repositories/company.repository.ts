import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Company } from "../models/company.model";
import { Address } from '../models/address.model';
import { Image } from '../models/image.model';

@Injectable()
export class CompanyRepository {

    findById(companyId: string): Promise<Company> {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                
                const db = snapshot.data();
                return new Company({
                    address: db.address,
                    email: db.email,
                    id: snapshot.id,
                    name: db.name,
                    pixKey: db.pixKey
                })
            })
    }

    update(companyId: string, update: UpdateCompany) {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .update({...update})
    }

    updateAddress(companyId: string, address: Address) {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .update({address})
    }

    updateLogo(companyId: string, logo: Image) {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .update({logo})
    }

}

type UpdateCompany = {
    name: string;
}