import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as busBoy from 'busboy';
import * as os from 'os';
import * as fs from 'fs';

@Injectable()
export class FileUploadStrategy implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('###1', os.tmpdir())
        const request = context.switchToHttp().getRequest();
        console.log('###2', request.headers)
        let busboy = busBoy({ headers: request.headers });
        console.log('###3', busboy);

        let filePath = '';
        busboy.on('file', function(name, stream, info) {
            console.log('###4', info)
            const fileType = info.filename.substring(info.filename.lastIndexOf('.'));
            console.log('###5', fileType)
            filePath = os.tmpdir() + randomUUID() + fileType;
            stream.pipe(fs.createWriteStream(filePath));
        });
        console.log('###3.1')

        request.pipe(busboy);
        console.log('###3.2')

        return new Promise((resolve) => {
            console.log('###3.3')
            busboy.on('finish', function() {
                console.log('###6', filePath)
                request.filePath = filePath;
                resolve(true);
            });
            console.log('###3.4')
        })
    }

}