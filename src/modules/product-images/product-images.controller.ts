import { Controller, UseGuards, Post, Param, Delete, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Base64UploadToFileName } from '../../file-upload/decorators/base64-upload-to-file-name.decorator';
import { Base64FileUploadToFileStrategy } from '../../file-upload/strategies/base64-upload-to-file-name.strategy';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { AddProductImageCommand } from './commands/add-product-image/add-product-image.command';
import { DeleteProductImageCommand } from './commands/delete-product-image/delete-product-image.command';
import { Request } from 'express';
import * as multiparty from 'multiparty';

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
    @Req() request: Request
  ) {
    var form = new multiparty.Form();
    form.parse(request, (err, fields, formData) => {
      if (err){ 
        console.log('### error', err);
      } else {
        console.log('### success', formData?.file?.length || 0);
        console.log('### success', JSON.stringify(formData?.file));
      }
    });
    return null;
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
