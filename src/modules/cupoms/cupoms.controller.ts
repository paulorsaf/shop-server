import { Controller, UseGuards, Get, Body, Post } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { CreateCupomCommand } from './commands/create-cupom/create-cupom.command';
import { CreateCupomDTO } from './dtos/create-cupom.dto';
import { FindCupomsByCompanyQuery } from './queries/find-cupoms-by-company/find-cupoms-by-company.query';

@Controller('cupoms')
export class CupomsController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindCupomsByCompanyQuery(
        user.companyId
      )
    )
  }

  @UseGuards(JwtAdminStrategy)
  @Post()
  create(@AuthUser() user: User, @Body() cupom: CreateCupomDTO) {
    return this.commandBus.execute(
      new CreateCupomCommand(
        user.companyId,
        cupom,
        user.id
      )
    )
  }

}
