import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CreateCupomCommandHandler } from './commands/create-cupom/create-cupom.command.handler';
import { CupomsController } from './cupoms.controller';
import { FindCupomsByCompanyQueryHandler } from './queries/find-cupoms-by-company/find-cupoms-by-company.query.handler';
import { CupomRepository } from './repositories/cupom.repository';

@Module({
  controllers: [
    CupomsController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    CupomRepository,

    FindCupomsByCompanyQueryHandler,

    CreateCupomCommandHandler
  ]
})
export class CupomsModule {}
