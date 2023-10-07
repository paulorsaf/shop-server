import { Controller, UseGuards, Get, Post, Param, Body, Patch, Delete, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { ChangeProductVisibilityCommand } from './commands/change-product-visibility/change-product-visibility.command';
import { CreateProductCommand } from './commands/create-product/create-product.command';
import { CreateProductDTO } from './commands/create-product/dtos/create-product.dto';
import { DeleteProductCommand } from './commands/delete-product/delete-product.command';
import { UpdateProductDTO } from './commands/update-product/dtos/update-product.dto';
import { UpdateProductCommand } from './commands/update-product/update-product.command';
import { FindProductsByCompanyQuery } from './queries/find-by-company/find-products-by-company.query';
import { FindProductByIdQuery } from './queries/find-by-id/find-product-by-id.query';
import { MultipartUploadToFilePathStrategy } from '../../file-upload/strategies/multipart-upload-to-file-path.strategy';
import { MultipartUploadToFilePath } from '../../file-upload/decorators/multipart-upload-to-file-path.decorator';
import { UpdateProductsFromFileUploadCommand } from './commands/update-products-from-file-upload/update-products-from-file-upload.command';

@Controller('products')
export class ProductsController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(
    @AuthUser() user: User,
    @Query('page') page: string = "0",
    @Query('internalId') internalId: string = "",
    @Query('categoryId') categoryId: string = ""
  ) {
    return this.queryBus.execute(
      new FindProductsByCompanyQuery(
        user.companyId,
        parseInt(page),
        internalId,
        categoryId
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Get(':productId')
  findById(@AuthUser() user: User, @Param('productId') productId: string) {
    return this.queryBus.execute(
      new FindProductByIdQuery(user.companyId, productId)
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Post()
  save(@AuthUser() user: User, @Body() product: CreateProductDTO) {
    return this.commandBus.execute(
      new CreateProductCommand(
        product, user.companyId, user.id
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':productId')
  update(@AuthUser() user: User, @Param('productId') productId: string, @Body() product: UpdateProductDTO) {
    return this.commandBus.execute(
      new UpdateProductCommand(
        {...product, id: productId}, user.companyId, user.id
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Delete(':productId')
  delete(@AuthUser() user: User, @Param('productId') productId: string) {
    return this.commandBus.execute(
      new DeleteProductCommand(
        productId, user.id, user.companyId
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':productId/visibilities')
  changeVisibility(
    @AuthUser() user: User,
    @Param('productId') productId: string
  ) {
    return this.commandBus.execute(
      new ChangeProductVisibilityCommand(
        user.companyId,
        user.id,
        productId
      )
    );
  }

  @UseGuards(JwtAdminStrategy, MultipartUploadToFilePathStrategy)
  @Post('uploads')
  upload(
    @AuthUser() user: User,
    @MultipartUploadToFilePath() filePath: string
  ) {
    return this.commandBus.execute(
      new UpdateProductsFromFileUploadCommand(
        user.id,
        user.companyId,
        filePath
      )
    );
  }

}
