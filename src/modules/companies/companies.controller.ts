import { Controller, UseGuards, Get, Param, Patch, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { UpdateCompanyAddressCommand } from './commands/update-company-address/update-company-address.command';
import { Address } from './models/address.model';
import { FindCompanyByIdQuery } from './queries/find-company-by-id/find-company-by-id.query';
import { UpdateCompanyCommand } from './commands/update-company/update-company.command';
import { Base64FileUploadToFileStrategy } from '../../file-upload/strategies/base64-upload-to-file-name.strategy';
import { Base64UploadToFileName } from '../../file-upload/decorators/base64-upload-to-file-name.decorator';
import { UpdateCompanyLogoCommand } from './commands/update-company-logo/update-company-logo.command';

@Controller('companies')
export class CompaniesController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get(':id')
  findById(@AuthUser() user: User, @Param('id') id: string) {
    return this.queryBus.execute(
      new FindCompanyByIdQuery(
        user.companyId, {
          companyId: user.companyId,
          id: user.id
        }
      )
    )
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':id')
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body('name') name: string
  ) {
    return this.commandBus.execute(
      new UpdateCompanyCommand(
        id,
        { name },
        { companyId: user.companyId, id: user.id }
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':id/address')
  updateAddress(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() address: Address
  ) {
    return this.commandBus.execute(
      new UpdateCompanyAddressCommand(
        id,
        address,
        { companyId: user.companyId, id: user.id }
      )
    );
  }

  @UseGuards(JwtAdminStrategy, Base64FileUploadToFileStrategy)
  @Patch(':id/logos')
  updateLogo(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Base64UploadToFileName() filePath: string
  ) {
    return this.commandBus.execute(
      new UpdateCompanyLogoCommand(
        id,
        filePath,
        { companyId: user.companyId, id: user.id }
      )
    );
  }

}
