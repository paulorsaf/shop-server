import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class TokenRepository {

    verifyToken(token: string) {
        return admin.auth().verifyIdToken(token);
    }

}