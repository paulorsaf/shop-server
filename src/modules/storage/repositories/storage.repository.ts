import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";

@Injectable()
export class StorageRepository {

    async deleteFolder(image: DeleteFolder) {
        await admin.storage()
            .bucket()
            .deleteFiles({
                prefix: `${image.companyId}/${image.productId}`
            });
    }

    async deleteImage(image: DeleteImage) {
        try {
            const file = admin.storage()
                .bucket()
                .file(`${image.companyId}/${image.productId}/${image.fileName}`);
    
            await file.delete();
        } catch (e){}
    }

}

type DeleteFolder = {
    companyId: string;
    productId: string;
}

type DeleteImage = {
    companyId: string;
    productId: string;
    fileName: string;
}