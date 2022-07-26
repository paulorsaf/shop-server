import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { BannerProduct } from "../entities/banner-product";

@Injectable()
export class ProductRepository {

    async findById(productId: string): Promise<BannerProduct> {
        return admin.firestore()
            .collection('products')
            .doc(productId)
            .get()
            .then(snapshot => {
                if (snapshot.exists) {
                    const bannerProduct = <BannerProduct> snapshot.data();
                    return {
                        id: snapshot.id,
                        images: bannerProduct.images,
                        name: bannerProduct.name,
                        price: bannerProduct.price,
                        priceWithDiscount: bannerProduct.priceWithDiscount
                    };
                }
                return null;
            })
    }

}