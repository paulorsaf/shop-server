import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Client } from '../models/client.model';

@Injectable()
export class ClientRepository {

  async findByCompany(companyId: string) {
    return admin.firestore()
      .collection('users')
      .where('companies', 'array-contains', companyId)
      .orderBy('name', 'asc')
      .get()
      .then(snapshot =>
        snapshot.docs.map(d => {
          const data = d.data();
          return new Client({
            cpfCnpj: data.cpfCnpj,
            createdAt: data.createdAt,
            email: data.email,
            id: d.id,
            name: data.name,
            phone: data.phone
          })
        })
      );
  }

}