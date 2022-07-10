import { Module } from '@nestjs/common';
import { FirebaseAdminModule } from '@aginix/nestjs-firebase-admin'
import * as admin from 'firebase-admin';

@Module({
  imports: [
    // FirebaseAdminModule.forRoot({
    //   credential: admin.credential.cert({
    //     projectId: "shop-354211",
    //     clientEmail: "firebase-adminsdk-7q4i1@shop-354211.iam.gserviceaccount.com",
    //     privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDLBBdYgBZmRl44\n8/9u+tQEL52w8c8y8GCDLh11baCj02/uXtfzqKzBTIVICFQxqLiz4FoNeQJtpFgM\n7l2MyYKHTe5nEufwnoH5YYP4m+lGmq+mvtOXvSs4rcPGFrFBvMeLn1AguqU+1o1v\nQBUxFtmmx9HdCCVkNuRPtNXGkm6NZGqFd9kbNpdhZ4sTAMNg7PQKVFAYhhuC4llP\n05bjaczWOc9ch51YilLncO92ukNbwN0yHOMqWWJFh/3S1mzqE5Auwi1MKDzOwlIz\nnSyDkYNIVdOw/k61cBhKlXzvuYP28g2G0qrAKz2BVzyoHGtdQbKHyXfQR2RZXRZA\nbW61FeXHAgMBAAECggEAVJzraADWlSDd82nKe8RB6k64L//QZkAmUXY+Y+thiPY+\nUACqi8yw182fPSLviFT0SlAG6FeXif/1jMoqJlv0MZVq9/26uqAttrUMbmj45Grj\nK6GcCcGXioNttZlOnoHiPxCSslloNtTwVL5GNtP5udfNYYycHPT92jSZ5q2wMvA5\ndJ9e8NAqdYnK77SplANKyBydO5jZH4xBwETr0miKF+X8+Ealx/5xIQgAwMTXhxMq\n700egS5Yoke23Li7pvf93s/X4rLb4aSKRp/T3UoKDfWpu48zTJon2gYW4iJhvoKu\nBCVhSNBYsnfBY4o30+CLubY6rGjzcZ+IiGyZz3DpuQKBgQDulJRPmTtbfahzVUsH\n/js7RleN7Gh0HBxeHsh+iqJgj4HAFPndRfnts6sW4OSLkkYS14tqVCfao44mJeb+\niSXlMTOtq7U8pLs5CeUvkuLbXt8azFy+RxNwxU84MEM71yLhyqy4IrxJ5MnSnuzz\nI9IAupyXHVcG7YtU2Kg6SOLmrwKBgQDZ1sKsK2Tv36OXBZEEmbJkzy78dO22ZLjR\n1zetp2xhW6uGhCnRRilFR8gPVylK8BKv+cemhh4rGUSlcMc4bzSsj+mjQogca/LY\nchOgPM9L49MDp2g4lOMiJ9Z4x+ds6CqjwPPYD7fYO2ipep4VOBQZFPjp/YXJ/6rz\n4V2N3yE4aQKBgQCHV65TAYBUxJIc61PnMufzFlJw5p3S0GefVSMz9f1rfb2Dc+LT\nDfFcUUJLdkTwkIhEBBbIuPjq5UGsjm/eEXt361N/wBrOTj0PfHeRZ2hePhGeqDQs\nlTGIFcZ8/5QEjGTzZgBZbQsXeDytyQ5uV/G4DCTs7O4DthoGhenZNqPRbQKBgQCs\nau9qlm4t7jTtM9q0aXJpmBL4fxQnaVFfxZisOfful0AMGE+A9Kd1znrqqXJlfd9M\nqcb8Zus58aYDzF/iqyJl8wJZ1i8lT8vGxYQDMB5jUs+R9M7o+e9M+Xsn3hGugZQ+\nSFq4iLhazarpecPlx50gvRjHG4LpfxMwNRB3WkRRAQKBgDDdeveRNMpsUDJgePJE\nDff/au/riIKIr8v/AHzTIQLTfL6bU3RY6bkc6NRhiBHg2AjLtg6YXfm2Nv0x/JJz\nroGIyK8jDqvotfcH2aNIhv5lkWdDoBZAj2wm2NSlN3gH4Oqer16wRHIlyKfLp/W9\nEUb3dcSytFVJ4452Ds0GU3YU\n-----END PRIVATE KEY-----\n"
    //   })
    // })
  ]
})
export class FirebaseAdminAppModule {}