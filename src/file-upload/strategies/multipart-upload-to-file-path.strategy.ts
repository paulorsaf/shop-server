import { BadRequestException, CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as Busboy from 'busboy';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class MultipartUploadToFilePathStrategy implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        return new Promise((resolve, reject) => {
            const bb = Busboy({headers: request.headers});
        
            bb.on('file', (name, file, info) => {
                const fileType = info.filename.substring(info.filename.lastIndexOf('.'));
                const filename = randomUUID() + fileType;
                const filepath = path.join(os.tmpdir(), `${filename}`);
                const fstream = fs.createWriteStream(filepath);
                file.pipe(fstream);
        
                request.filepath = filepath;
                resolve(true);
            });
            bb.on('error', (e) => {
                reject(new BadRequestException("Erro no upload do arquivo"));
            });
            if (request.rawBody) {
                bb.end(request.rawBody);
            } else {
                request.pipe(bb);
            }
        })
    }

}