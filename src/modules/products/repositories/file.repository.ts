import { Injectable } from '@nestjs/common';
import { WorkBook, read as readXlsx } from 'xlsx';
import * as fs from 'fs/promises';

@Injectable()
export class FileRepository {

  constructor(
  ) {}

  async loadProductsFromFile(filePath: string): Promise<WorkBook> {
    const data = await fs.readFile(filePath);

    return readXlsx(data, {type: "buffer"});
  }

}