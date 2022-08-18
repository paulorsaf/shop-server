import { Injectable } from "@nestjs/common";
import { format } from "date-fns";
import * as admin from 'firebase-admin';
import { Banner } from "../entities/banner";

@Injectable()
export class BannerRepository {

    findByCompany(companyId: string): Promise<Banner[]> {
        return admin.firestore()
            .collection('banners')
            .where('companyId', '==', companyId)
            .get()
            .then(snapshot => {
                return snapshot.docs.map(d => {
                    const banner = d.data();
                    return new Banner(
                        banner.companyId, d.id, banner.productId
                    )
                })
            })
    }

    findById(bannerId: string): Promise<Banner> {
        return admin.firestore()
            .collection('banners')
            .doc(bannerId)
            .get()
            .then(snapshot => {
                if (snapshot.exists) {
                    const banner = <Banner> snapshot.data();
                    return new Banner(
                        banner.companyId, snapshot.id, banner.productId
                    );
                }
                return null;
            })
    }

    delete(bannerId: string) {
        return admin.firestore()
            .collection('banners')
            .doc(bannerId)
            .delete();
    }

    save(saveBanner: SaveBanner): Promise<string> {
        const banner = {
            ...JSON.parse(JSON.stringify(saveBanner)),
            createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSSS')
        }

        return admin.firestore()
            .collection('banners')
            .add(banner)
            .then(response => response.id);
    }

    update(updateBanner: UpdateBanner) {
        const banner = {
            ...JSON.parse(JSON.stringify(updateBanner)),
            updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSSS')
        }

        return admin.firestore()
            .collection('banners')
            .doc(updateBanner.id)
            .update(banner);
    }

}

type SaveBanner = {
    companyId: string;
    productId: string;
    createdBy: string;
}

type UpdateBanner = {
    id: string;
    productId: string;
    updatedBy: string;
}