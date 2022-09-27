import { Controller, UseGuards, Post, Param, Delete, Req, RawBodyRequest } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Base64UploadToFileName } from '../../file-upload/decorators/base64-upload-to-file-name.decorator';
import { Base64FileUploadToFileStrategy } from '../../file-upload/strategies/base64-upload-to-file-name.strategy';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { AddProductImageCommand } from './commands/add-product-image/add-product-image.command';
import { DeleteProductImageCommand } from './commands/delete-product-image/delete-product-image.command';
import { Request } from 'express';
import * as Busboy from 'busboy';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

@Controller('products/:productId/images')
export class ProductImagesController {
  
  constructor(
    private commandBus: CommandBus
  ) {}

  @UseGuards(JwtAdminStrategy, Base64FileUploadToFileStrategy)
  @Post()
  add(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @Base64UploadToFileName() fileName: string
  ) {
    return this.commandBus.execute(
      new AddProductImageCommand(
        user.companyId, productId, fileName, user.id
      )
    )
  }

  @UseGuards(JwtAdminStrategy)
  @Post('test')
  addNew(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @Req() request: RawBodyRequest<Request>
  ) {
    return new Promise((resolve, reject) => {
      console.log('### starting bus boy')
      const bb = Busboy({
        headers: request.headers
      });
  
      let fbCollTicketData: any;
      bb.on('file', (name, file, info) => {
        console.log("### Execution started, file Block");
        const { filename } = info;
        const filepath = path.join(os.tmpdir(), `${filename}`);
        const fstream = fs.createWriteStream(filepath);
        file.pipe(fstream);
        console.log("### Execution Ended, file Block");

        this.commandBus.execute(
          new AddProductImageCommand(
            user.companyId, productId, filepath, user.id
          )
        )
        .then(() => {
          console.log('### success')
          resolve(null)
        })
        .catch(error => {
          console.log('### error')
          reject(error)
        });
      });
      bb.on('field', (name, val, info) => {
        console.log("### Execution started, field Block");
        //console.log('Field [' + fieldname + ']: value: ' + val);
        console.log(`### Field [${name}]: value: %j`, val);
        if (name == 'data' && val) {
          fbCollTicketData = <any>JSON.parse(val);
        }
        console.log("### Execution Ended, field Block");
      });
      bb.on('error', (e) => {
        console.log("### Execution started, error Block");
        console.log(e);
        console.log("### Execution Ended, error Block");
        reject(e);
      });
      bb.on('close', () => {
        console.log('### Done parsing form!');
      });
      console.log('### raw body', request.rawBody);
      bb.end(request.rawBody);
    })
  }
  
  @UseGuards(JwtAdminStrategy)
  @Delete(':fileName')
  delete(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @Param('fileName') fileName: string
  ) {
    return this.commandBus.execute(
      new DeleteProductImageCommand(
        user.companyId, productId, fileName, user.id
      )
    );
  }

}
