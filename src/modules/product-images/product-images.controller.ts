import { Controller, UseGuards, Post, Param, UploadedFile, UseInterceptors, Delete } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { AddProductImageCommand } from './commands/add-product-image/add-product-image.command';
import { DeleteProductImageCommand } from './commands/delete-product-image/delete-product-image.command';

@Controller('products/:productId/images')
export class ProductImagesController {
  
  constructor(
    private commandBus: CommandBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './tmp', filename: (req, file, cb) => {
        const fileName = `${randomUUID()}${extname(file.originalname)}`
        cb(null, fileName)
      }
    })
  }))
  @Post()
  add(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.commandBus.execute(
      new AddProductImageCommand(
        user.companyId, productId, file, user.id
      )
    )
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
