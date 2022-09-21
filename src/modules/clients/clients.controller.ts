import { Controller, UseGuards, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { FindClientsByCompanyQuery } from './queries/find-clients-by-company/find-clients-by-company.query';

@Controller('clients')
export class ClientsController {
  
  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  findById(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindClientsByCompanyQuery(
        user.companyId
      )
    )
  }

}
