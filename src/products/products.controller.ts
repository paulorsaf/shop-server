import { Controller, UseGuards, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../authentication/guards/jwt.admin.strategy';
import { User } from '../authentication/model/user';
import { FindProductsByCompanyQuery } from './queries/find-by-company/find-products-by-company.query';

@Controller('products')
export class ProductsController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindProductsByCompanyQuery(user.companyId)
    );
  }

}
