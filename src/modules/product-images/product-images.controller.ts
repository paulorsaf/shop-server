import { Controller, UseGuards, Post, Param, Delete } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UploadedFilePath } from '../../authentication/decorators/uploaded-file-path.decorator';
import { FileUploadStrategy } from '../../authentication/guards/file-upload.strategy';
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

  @UseGuards(JwtAdminStrategy, FileUploadStrategy)
  @Post()
  add(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @UploadedFilePath() filePath: string
  ) {
    console.log('###7', filePath);
    return this.commandBus.execute(
      new AddProductImageCommand(
        user.companyId, productId, filePath, user.id
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
