import { Controller, Post, Body, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../authentication/guards/jwt.admin.strategy';
import { User } from '../authentication/model/user';
import { CreateCategoryCommand } from './commands/create-category/create-category.command';
import { UpdateCategoryCommand } from './commands/update-category/update-category.command';
import { CategoryUser } from './entities/category';
import { FindByCompanyQuery } from './queries/find-by-company/find-category-by-company.query';
import { FindCategoryByIdQuery } from './queries/find-by-id/find-category-by-id.query';

@Controller('categories')
export class CategoriesController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindByCompanyQuery(user.companyId)
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Get(':categoryId')
  findById(@AuthUser() user: User, @Param('categoryId') categoryId: string) {
    return this.queryBus.execute(
      new FindCategoryByIdQuery(user.companyId, categoryId)
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Post()
  create(@AuthUser() user: User, @Body("name") name: string) {
    return this.commandBus.execute(
      new CreateCategoryCommand(
        name, user.companyId, user.id
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':categoryId')
  update(@AuthUser() user: User, @Param('categoryId') categoryId: string, @Body("name") name: string) {
    return this.commandBus.execute(
      new UpdateCategoryCommand(
        categoryId, name, user.id, user.companyId
      )
    );
  }

}
