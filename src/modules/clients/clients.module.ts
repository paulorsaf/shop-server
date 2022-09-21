import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { ClientsController } from './clients.controller';
import { FindClientsByCompanyQueryHandler } from './queries/find-clients-by-company/find-clients-by-company-query.handler';
import { ClientRepository } from './repositories/client.repository';

@Module({
  controllers: [
    ClientsController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    ClientRepository,

    FindClientsByCompanyQueryHandler
  ]
})
export class ClientsModule {}
