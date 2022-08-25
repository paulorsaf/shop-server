import { Controller, UseGuards, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { FindPurchasesByUserCompanyQuery } from './queries/find-purchases-by-user-company/find-purchases-by-user-company.query';

@Controller('purchases')
export class PurchasesController {
  
  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindPurchasesByUserCompanyQuery(
        user.companyId,
        user.id
      )
    )
  }

}
