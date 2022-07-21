import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class StorageRepository {

    save(image: SaveProductImage) {
        return admin.storage().bucket().upload(image.filePath, {
            destination: this.getFileDestination(image)
        }).then(imageData => {
            return imageData[0].getSignedUrl({
                action: 'read', expires: '12-12-2999'
            }).then(response => ({
                fileName: this.getImageName(imageData[0].metadata.name),
                imageUrl: response[0]
            }))
        })
    }

    private getImageName(name: string) {
        const nameSplit = name.split('/');
        return nameSplit[nameSplit.length-1];
    }

    private getFileDestination(image: SaveProductImage) {
        return `${image.companyId}/${image.productId}/${new Date().getMilliseconds()}-${image.name}`
    }

}

type SaveProductImage = {
    companyId: string;
    productId: string;
    filePath: string;
    name: string;
}