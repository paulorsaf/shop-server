import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Company } from "../models/company.model";
import { Address } from '../models/address.model';
import { Image } from '../models/image.model';
import { Payment } from '../models/payment.model';
import { CompanyDetailsDTO } from '../dtos/company-details.dto';

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
                    aboutUs: db.aboutUs,
                    address: db.address,
                    canUpdateStock: db.canUpdateStock,
                    email: db.email,
                    hasToSendPurchaseToOwnSystem: db.hasToSendPurchaseToOwnSystem,
                    id: snapshot.id,
                    logo: db.logo,
                    name: db.name,
                    payment: db.payment,
                    facebook: db.facebook,
                    instagram: db.instagram,
                    website: db.website,
                    whatsapp: db.whatsapp
                })
            })
    }

    update(companyId: string, update: CompanyDetailsDTO) {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .update({...update})
    }

    updateAboutUs(companyId: string, html: string) {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .update({aboutUs: html})
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

    updatePayment(companyId: string, payment: Payment) {
        return admin.firestore()
            .collection('companies')
            .doc(companyId)
            .update({payment})
    }

}