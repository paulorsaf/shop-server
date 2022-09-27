import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { EventRepository } from '../../repositories/event.repository';
import { AddProductImageCommandHandler } from './commands/add-product-image/add-product-image-command.handler';
import { DeleteProductImageCommandHandler } from './commands/delete-product-image/delete-product-image-command.handler';
import { ProductImagesController } from './product-images.controller';
import { ProductImageRepository } from './repositories/product-image.repository';
import { ProductRepository } from './repositories/product.repository';
import { StorageRepository } from './repositories/storage.repository';
import { ProductImageSagas } from './sagas/product-image.saga';
import * as os from 'os';

const imageFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/.(jpg|jpeg.webp|png)$/)) {
    cb(new HttpException(`Tipo de arquivo ${extname(file.originalname)} não é válido.`, HttpStatus.BAD_REQUEST), false);
  }
  cb(null, true);
};

@Module({
  controllers: [
    ProductImagesController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: os.tmpdir(),
        fileFilter: imageFilter
      }),
    }),
  ],
  providers: [
    EventRepository,
    ProductRepository,
    StorageRepository,
    ProductImageRepository,
    
    AddProductImageCommandHandler,
    DeleteProductImageCommandHandler,

    ProductImageSagas
  ]
})
export class ProductImagesModule {}
