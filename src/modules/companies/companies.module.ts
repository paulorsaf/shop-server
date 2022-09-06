import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindCompanyByIdQueryHandler } from './queries/find-company-by-id/find-company-by-id-query.handler';
import { CompanyRepository } from './repositories/company.repository';
import { UpdateCompanyAddressCommandHandler } from './commands/update-company-address/update-company-address-command.handler';
import { UpdateCompanyCommandHandler } from './commands/update-company/update-company-command.handler';

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

    UpdateCompanyCommandHandler,
    UpdateCompanyAddressCommandHandler,

    FindCompanyByIdQueryHandler
  ]
})
export class CompaniesModule {}
