import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { BannersController } from './banners.controller';
import { FindBannersByCompanyQueryHandler } from './queries/find-banners-by-company/find-banners-by-company-query.handler';
import { BannerRepository } from './repositories/banner.repository';

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

    FindBannersByCompanyQueryHandler
  ]
})
export class BannersModule {}
