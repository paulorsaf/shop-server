import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import { ProductDb } from '../../../db/product.db';
import { CreateProductDTO } from '../commands/create-product/dtos/create-product.dto';
import { UpdateProductDTO } from '../commands/update-product/dtos/update-product.dto';
import { Product } from '../entities/product';
import { ProductsFromFile } from '../types/products-from-file.type';

@Injectable()
export class ProductRepository {

  constructor(
  ) {}

  findByCompany(param: FindByCompany) {
    let query = admin.firestore()
      .collection('products')
      .where('companyId', '==', param.companyId);

    if (param.categoryId) {
      query = query
        .where("categoryId", '==', param.categoryId);
    }
    if (param.internalId) {
      query = query
        .where("productInternalId", '==', param.internalId);
    }

    query = query
      .orderBy('name', 'asc')
      .offset(param.page * 30)
      .limit(30);
    
    return query
      .get()
      .then(snapshot =>
        snapshot.docs.map(d => <Product> {
          ...d.data(),
          id: d.id
        })
      );
  }

  delete(productId: string) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .delete();
  }

  findById(productId: string) {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .get()
      .then(snapshot => (<Product> {
        ...snapshot.data(),
        id: snapshot.id
      }));
  }

  findByCompanyIdAndId(companyId: string, productId: string): Promise<Product> {
    return admin.firestore()
      .collection('products')
      .doc(productId)
      .get()
      .then(snapshot => {
        if (snapshot.exists) {
          const product = snapshot.data() as ProductDb;
          if (product.companyId !== companyId) {
            return undefined;
          }
          
          return {
            ...product,
            id: snapshot.id,
            isVisible: product.isVisible === false ? false : true
          } as Product;
        }
        return undefined;
      });
  }

  findByCompanyIdAndProductInternalId(companyId: string, productInternalId: string)
    : Promise<Product> {
    return admin.firestore()
      .collection('products')
      .where("companyId", '==', companyId)
      .where("productInternalId", '==', productInternalId)
      .get()
      .then(snapshot => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          const product = snapshot.docs[0].data() as ProductDb;
          if (product.companyId !== companyId) {
            return undefined;
          }
          
          return {
            ...product,
            id: doc.id,
            isVisible: product.isVisible === false ? false : true
          } as Product;
        }
        return undefined;
      });
  }

  save(product: CreateProductDTO & {companyId: string, createdBy: string}): Promise<{id: string}> {
    return admin.firestore()
      .collection('products')
      .add({...product, createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T")})
      .then(snapshot => {
        return {id: snapshot.id}
      })
  }

  update(product: UpdateProductDTO & {companyId: string, updatedBy: string}): Promise<void> {
    const update = {
      ...product,
      updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T")
    }

    return admin.firestore()
      .collection('products')
      .doc(product.id)
      .update(update)
      .then(() => Promise.resolve())
  }

  updateFromUpload(params: UpdateFromUpload): Promise<void> {
    return Promise.all(
      params.products.map(async product => {
        const existingProduct = await this.findByCompanyIdAndProductInternalId(
          params.companyId, product.productInternalId
        );
        if (existingProduct) {
          return Promise.all([
            this.updateProductFromUpload({
              id: existingProduct.id,
              price: product.price,
              name: product.name
            }, params.userId, product.stock),
            this.updateProductStockFromUpload(existingProduct, product.stock)
          ])
        }
      })
    )
    .then(() => undefined);
  }

  setVisibility(params: SetVisibility): Promise<void> {
    const update = {
      isVisible: params.isVisible,
      updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T")
    }

    return admin.firestore()
      .collection('products')
      .doc(params.productId)
      .update(update)
      .then(() => Promise.resolve())
  }

  private updateProductFromUpload(product: UpdateProductFromUpload, userId: string, stock: number) {
    admin
      .firestore()
      .collection('products')
      .doc(product.id)
      .update({
        price: product.price,
        name: product.name || "",
        totalStock: stock,
        updatedAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss').replace(" ", "T"),
        updatedBy: userId
      })
  }

  private updateProductStockFromUpload(product: Product, stock: number) {
    return admin
      .firestore()
      .collection('stocks')
      .where('productId', '==', product.id)
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          return;
        }
        const doc = snapshot.docs[0];
        return admin
          .firestore()
          .collection('stocks')
          .doc(doc.id)
          .update({
            quantity: stock
          })
      })
  }

}

type FindByCompany = {
  categoryId: string;
  companyId: string;
  internalId: string;
  page: number;
}

type SetVisibility = {
  productId: string;
  isVisible: boolean;
}

type UpdateFromUpload = {
  companyId: string;
  userId: string;
  products: ProductsFromFile[];
}

type UpdateProductFromUpload = {
  id: string;
  price: number;
  name: string;
}