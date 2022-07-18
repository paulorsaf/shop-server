import { Controller, UseGuards, Get, Param, Post, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../authentication/guards/jwt.admin.strategy';
import { User } from '../authentication/model/user';
import { AddStockOptionCommand } from './commands/add-stock-option/add-stock-option.command';
import { AddStockOption } from './dtos/add-stock-option';
import { StockOption } from './entities/stock';
import { FindStockByProductQuery } from './queries/find-stock-by-product/find-stock-by-product.query';

@Controller('products/:productId/stocks')
export class StocksController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User, @Param('productId') productId: string) {
    return this.queryBus.execute(
      new FindStockByProductQuery(user.companyId, productId)
    )
  }

  @UseGuards(JwtAdminStrategy)
  @Post()
  save(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @Body() addStockOption: AddStockOption
  ) {
    return this.commandBus.execute(
      new AddStockOptionCommand(
        user.companyId, productId, addStockOption, user.id
      )
    )
  }

}
