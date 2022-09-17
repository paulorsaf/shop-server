import { Controller, UseGuards, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { FindDailyPurchaseSummariesQuery } from './queries/find-daily-purchase-summaries/find-daily-purchase-summaries.query';

@Controller('purchases/summaries')
export class PurchaseSummaryController {
  
  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get('daily')
  findDaily(@AuthUser() user: User, @Query('from') from: string, @Query('until') until: string) {
    return this.queryBus.execute(
      new FindDailyPurchaseSummariesQuery(
        user.companyId,
        from,
        until
      )
    )
  }

}
