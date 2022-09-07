import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindAddressByZipcodeQueryHandler } from './queries/find-address-by-zipcode/find-address-by-zipcode-query.handler';
import { AddressRepository } from './repositories/address.repository';

@Module({
  controllers: [AddressController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    AddressRepository,

    FindAddressByZipcodeQueryHandler
  ]
})
export class AddressModule {}
