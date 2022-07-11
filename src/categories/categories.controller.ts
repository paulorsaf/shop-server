import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../authentication/guards/jwt.admin.strategy';
import { User } from '../authentication/model/user';
import { CreateCategoryCommand } from './commands/create-category/create-category.command';
import { CategoryUser } from './entities/category';
import { FindByCompanyQuery } from './queries/find-categories/find-by-company.query';

@Controller('categories')
export class CategoriesController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Post()
  create(@AuthUser() user: User, @Body("name") name: string) {
    return this.commandBus.execute(
      new CreateCategoryCommand(
        name,
        user.companyId,
        new CategoryUser(user.id, user.name, user.email)
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindByCompanyQuery(user.companyId)
    );
  }

}
