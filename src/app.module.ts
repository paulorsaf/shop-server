import { Module } from '@nestjs/common';
import { SaveEventHandler } from './events/save-event-event.handler';
import { BannersModule } from './modules/banners/banners.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { ProductsModule } from './modules/products/products.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { StorageModule } from './modules/storage/storage.module';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [
    BannersModule,
    CategoriesModule,
    ProductsModule,
    ProductImagesModule,
    StorageModule,
    StocksModule
  ],
  providers: [
    EventRepository,
    
    SaveEventHandler
  ]
})
export class AppModule {}
