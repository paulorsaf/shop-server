import { Module } from '@nestjs/common';
import { SaveEventHandler } from './events/save-event-event.handler';
import { AddressModule } from './modules/address/address.module';
import { BannersModule } from './modules/banners/banners.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ClientsModule } from './modules/clients/clients.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { EmailModule } from './modules/email/email.module';
import { ProductImagesModule } from './modules/product-images/product-images.module';
import { ProductsModule } from './modules/products/products.module';
import { PurchaseSummaryModule } from './modules/purchase-summaries/purchase-summary.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { StorageModule } from './modules/storage/storage.module';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [
    AddressModule,
    BannersModule,
    CategoriesModule,
    ClientsModule,
    CompaniesModule,
    EmailModule,
    ProductsModule,
    ProductImagesModule,
    PurchasesModule,
    PurchaseSummaryModule,
    StorageModule,
    StocksModule
  ],
  providers: [
    EventRepository,
    
    SaveEventHandler
  ]
})
export class AppModule {}
