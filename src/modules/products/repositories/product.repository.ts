import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import { CreateProductDTO } from '../commands/create-product/dtos/create-product.dto';
import { UpdateProductDTO } from '../commands/update-product/dtos/update-product.dto';
import { Product } from '../entities/product';

@Injectable()
export class ProductRepository {

  constructor(
  ) {}

  async findByCompany(companyId: string) {
    return admin.firestore()
      .collection('products')
      .where('companyId', '==', companyId)
      .orderBy('name', 'asc')
      .get()
      .then(snapshot =>
        snapshot.docs.map(d => <Product> {
          ...d.data(),
          id: d.id
        })
      );
  }

  async delete(productId: string) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .delete();
  }

  async findById(productId: string) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .get()
      .then(snapshot => (<Product> {
        ...snapshot.data(),
        id: snapshot.id
      }));
  }

  async save(product: CreateProductDTO & {companyId: string, createdBy: string}): Promise<{id: string}> {
    return admin.firestore()
      .collection('products')
      .add({...product, createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSSS')})
      .then(snapshot => {
        return {id: snapshot.id}
      })
  }

  async update(product: UpdateProductDTO & {companyId: string, updatedBy: string}): Promise<void> {
    const update = {
      ...product,
      updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss:SSSS')
    }

    return admin.firestore()
      .collection('products')
      .doc(product.id)
      .update(update)
      .then(() => Promise.resolve())
  }

}