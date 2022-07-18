import { Controller, UseGuards, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { AddStockOptionCommand } from './commands/add-stock-option/add-stock-option.command';
import { CreateStockOptionCommand } from './commands/create-stock-option/create-stock-option.command';
import { StockOptionDTO } from './dtos/stock-option-dto';
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
  create(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @Body() createStockOption: StockOptionDTO
  ) {
    return this.commandBus.execute(
      new CreateStockOptionCommand(
        user.companyId, productId, createStockOption, user.id
      )
    )
  }

  @UseGuards(JwtAdminStrategy)
  @Patch()
  add(
    @AuthUser() user: User,
    @Param('productId') productId: string,
    @Body() addStockOption: StockOptionDTO
  ) {
    return this.commandBus.execute(
      new AddStockOptionCommand(
        user.companyId, productId, addStockOption, user.id
      )
    )
  }

}
