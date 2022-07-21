import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageRepository {

    async deleteImage(image: DeleteImage) {
        const file = admin.storage()
            .bucket()
            .file(`${image.companyId}/${image.productId}/${image.fileName}`);

        await file.delete();
    }

}

type DeleteImage = {
    companyId: string;
    productId: string;
    fileName: string;
}