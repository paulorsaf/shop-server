import * as admin from 'firebase-admin';

export class StorageRepository {

    save(image: SaveProductImage) {
        return admin.storage().bucket().upload('./' + image.filePath, {
            destination: this.getFileDestination(image)
        }).then(response =>
            response[0].getSignedUrl({
                action: 'read', expires: '12-12-2999'
            }).then(response => response[0])
        )
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