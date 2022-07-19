import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { ProductsModule } from './modules/products/products.module';
import { StocksModule } from './modules/stocks/stocks.module';

@Module({
  imports: [
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    StocksModule
  ]
})
export class AppModule {}
