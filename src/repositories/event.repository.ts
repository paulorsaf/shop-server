import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { format } from 'date-fns';

@Injectable()
export class EventRepository {

    addEvent(event: any) {
        return admin.firestore().collection('events').add(
            JSON.parse(JSON.stringify({
                ...event,
                timestamp: format(new Date(), 'yyy-MM-dd HH:mm:ss')
            }))
        );
    }

}