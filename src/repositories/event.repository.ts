import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";

@Injectable()
export class EventRepository {

    addEvent(event: any) {
        return admin.firestore().collection('events').add(
            JSON.parse(JSON.stringify({
                ...event,
                timestamp: new Date().toISOString()
            }))
        );
    }

}