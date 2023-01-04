import { Controller, UseGuards, Get, Param, Patch, Body, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { CancelPurchaseProductCommand } from './commands/cancel-purchase-product/cancel-purchase-product.command';
import { EditPurchaseProductQuantityCommand } from './commands/edit-purchase-product/edit-purchase-product-quantity.command';
import { SendPurchaseToSystemCommand } from './commands/send-purchase-to-system/send-purchase-to-system.command';
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

  @UseGuards(JwtAdminStrategy)
  @Post(':id/system')
  sendToSystem(
    @AuthUser() user: User,
    @Param('id') purchaseId: string
  ) {
    return this.commandBus.execute(
      new SendPurchaseToSystemCommand(
        user.companyId,
        purchaseId,
        user.id
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Post(':id/products/:productId/stocks/:stockId')
  editPurchaseProduct(
    @AuthUser() user: User,
    @Param('id') purchaseId: string,
    @Param('productId') productId: string,
    @Param('stockId') stockId: string,
    @Body('value') value: number
  ) {
    return this.commandBus.execute(
      new EditPurchaseProductQuantityCommand(
        user.companyId,
        user.id,
        purchaseId,
        productId,
        stockId,
        value
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Post(':id/products/:productId/stocks/:stockId')
  cancelPurchaseProduct(
    @AuthUser() user: User,
    @Param('id') purchaseId: string,
    @Param('productId') productId: string,
    @Param('stockId') stockId: string
  ) {
    return this.commandBus.execute(
      new CancelPurchaseProductCommand(
        user.companyId,
        user.id,
        purchaseId,
        productId,
        stockId
      )
    );
  }

}
