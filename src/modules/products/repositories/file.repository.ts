import { Injectable } from '@nestjs/common';
import { WorkBook, read as readXlsx } from 'xlsx';
import * as admin from 'firebase-admin';

@Injectable()
export class FileRepository {

  constructor(
  ) {}

  async loadProductsFromFile(filePath: string): Promise<WorkBook> {
    const storageResponse = await admin.storage()
      .bucket('gs://shop-354211.appspot.com')
      .file(filePath)
      .get();
    
    return storageResponse[0].download()
      .then(file => readXlsx(file[0], {type: "buffer"}));
  }

}