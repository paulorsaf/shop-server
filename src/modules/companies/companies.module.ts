import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindCompanyByIdQueryHandler } from './queries/find-company-by-id/find-company-by-id-query.handler';
import { CompanyRepository } from './repositories/company.repository';
import { UpdateCompanyAddressCommandHandler } from './commands/update-company-address/update-company-address-command.handler';
import { UpdateCompanyCommandHandler } from './commands/update-company/update-company-command.handler';
import { UpdateCompanyLogoCommandHandler } from './commands/update-company-logo/update-company-logo-command.handler';
import { StorageRepository } from './repositories/storage.repository';
import { UpdateCompanyAboutUsCommandHandler } from './commands/update-company-about-us/update-company-about-us-command.handler';
import { UpdateCompanyPaymentCommandHandler } from './commands/update-company-payment/update-company-payment-command.handler';

@Module({
  controllers: [
    CompaniesController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    CompanyRepository,
    StorageRepository,

    UpdateCompanyCommandHandler,
    UpdateCompanyAboutUsCommandHandler,
    UpdateCompanyAddressCommandHandler,
    UpdateCompanyLogoCommandHandler,
    UpdateCompanyPaymentCommandHandler,

    FindCompanyByIdQueryHandler
  ]
})
export class CompaniesModule {}
