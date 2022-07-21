import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as fs from 'fs';

@Injectable()
export class Base64FileUploadToFileStrategy implements CanActivate {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const body = request.body;

        const fileName = randomUUID() + body.name;
        const buff = Buffer.from(body.file.replace(/^data:image\/png;base64,/, ""), 'base64');
        fs.writeFileSync(fileName, buff);

        request.fileName = fileName;

        return true;
    }

}