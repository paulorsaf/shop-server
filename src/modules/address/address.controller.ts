import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { FindAddressByZipcodeQuery } from './queries/find-address-by-zipcode/find-address-by-zipcode.query';

@Controller('address/zipcode')
export class AddressController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get(':zipCode')
  findByZipCode(@Param('zipCode') zipCode: string) {
    return this.queryBus.execute(
      new FindAddressByZipcodeQuery(
        zipCode
      )
    )
  }

}
