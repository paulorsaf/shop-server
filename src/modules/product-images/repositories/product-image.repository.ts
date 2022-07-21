import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProductImageRepository {

    addImage(productImage: AddProductImage) {
        return admin.firestore()
            .collection('products')
            .doc(productImage.productId)
            .update({
                images: admin.firestore.FieldValue.arrayUnion({
                    fileName: productImage.fileName,
                    imageUrl: productImage.imageUrl
                })
            });
    }

    removeImage(productImage: AddProductImage) {
        return admin.firestore()
            .collection('products')
            .doc(productImage.productId)
            .update({
                images: admin.firestore.FieldValue.arrayRemove({
                    fileName: productImage.fileName,
                    imageUrl: productImage.imageUrl
                })
            });
    }

}

type AddProductImage = {
    fileName: string;
    imageUrl: string;
    productId: string;
}