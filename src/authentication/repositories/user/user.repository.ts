import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User } from 'src/authentication/model/user';

@Injectable()
export class UserRepository {

    findByUid(uid: string): Promise<User> {
        return admin.firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then(snapshot => {
                const user = snapshot.data();
                return {
                    companyId: user.companyId,
                    email: user.email,
                    id: uid,
                    name: user.name,
                    type: user.type
                }
            });
    }

}