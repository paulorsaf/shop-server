import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { User } from '../model/user.model';

@Injectable()
export class UserRepository {

  async findById(id: string): Promise<User> {
    return admin.firestore()
      .collection('users')
      .doc(id)
      .get()
      .then(snapshot => {
        if (!snapshot.exists) {
          return null;
        }
        const userDb = snapshot.data();
        return {
          cpfCnpj: userDb.cpfCnpj,
          name: userDb.name,
          phone: userDb.phone
        }
      })
  }

}