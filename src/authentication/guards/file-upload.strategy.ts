import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as busBoy from 'busboy';
import * as os from 'os';
import * as fs from 'fs';

@Injectable()
export class FileUploadStrategy implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        let busboy = busBoy({ headers: request.headers });

        let filePath = '';
        busboy.on('file', function(name, stream, info) {
            const fileType = info.filename.substring(info.filename.lastIndexOf('.'));
            filePath = os.tmpdir() + randomUUID() + fileType;
            stream.pipe(fs.createWriteStream(filePath));
        });

        request.pipe(busboy);

        return new Promise((resolve) => {
            busboy.on('finish', function() {
                request.filePath = filePath;
                resolve(true);
            });
        })
    }

}