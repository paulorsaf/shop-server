import { Controller, UseGuards, Get, Param, Patch, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { UpdatePurchaseStatusCommand } from './commands/update-purchase-status/update-purchase-status.command';
import { FindPurchaseByIdAndCompanyQuery } from './queries/find-purchase-by-id-and-company/find-purchase-by-id-and-company.query';
import { FindPurchasesByUserQuery } from './queries/find-purchases-by-company/find-purchases-by-company.query';

@Controller('purchases')
export class PurchasesController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindPurchasesByUserQuery(
        user.companyId
      )
    )
  }

  @UseGuards(JwtAdminStrategy)
  @Get(':id')
  findById(@AuthUser() user: User, @Param('id') id: string) {
    return this.queryBus.execute(
      new FindPurchaseByIdAndCompanyQuery(
        user.companyId,
        id
      )
    )
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':id/status')
  updateStatus(
    @AuthUser() user: User,
    @Param('id') purchaseId: string,
    @Body() status: {status: string, reason: string}
  ) {
    return this.commandBus.execute(
      new UpdatePurchaseStatusCommand(
        user.companyId,
        purchaseId,
        status,
        user.id
      )
    )
  }

}
