import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { BannersController } from './banners.controller';
import { CreateBannerDetailCommandHandler } from './commands/create-banner-detail/create-banner-detail-command.handler';
import { DeleteBannerDetailCommandHandler } from './commands/delete-banner-detail/delete-banner-detail-command.handler';
import { UpdateBannerDetailCommandHandler } from './commands/update-banner-detail/update-banner-detail-command.handler';
import { FindBannerByIdQueryHandler } from './queries/find-banner-by-id/find-banner-by-id-query.handler';
import { FindBannersByCompanyQueryHandler } from './queries/find-banners-by-company/find-banners-by-company-query.handler';
import { BannerRepository } from './repositories/banner.repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  controllers: [
    BannersController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    BannerRepository,
    ProductRepository,

    FindBannersByCompanyQueryHandler,
    FindBannerByIdQueryHandler,

    CreateBannerDetailCommandHandler,
    UpdateBannerDetailCommandHandler,
    DeleteBannerDetailCommandHandler
  ]
})
export class BannersModule {}
