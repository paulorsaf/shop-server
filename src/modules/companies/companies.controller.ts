import { Controller, UseGuards, Get, Param, Patch, Body } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { UpdateCompanyAddressCommand } from './commands/update-company-address/update-company-address.command';
import { Address } from './models/address.model';
import { FindCompanyByIdQuery } from './queries/find-company-by-id/find-company-by-id.query';
import { UpdateCompanyCommand } from './commands/update-company/update-company.command';
import { UpdateCompanyLogoCommand } from './commands/update-company-logo/update-company-logo.command';
import { UpdateCompanyAboutUsCommand } from './commands/update-company-about-us/update-company-about-us.command';
import { PaymentDTO } from './dtos/payment.dto';
import { UpdateCompanyPaymentCommand } from './commands/update-company-payment/update-company-payment.command';
import { CompanyDetailsDTO } from './dtos/company-details.dto';
import { MultipartUploadToFilePathStrategy } from '../../file-upload/strategies/multipart-upload-to-file-path.strategy';
import { MultipartUploadToFilePath } from '../../file-upload/decorators/multipart-upload-to-file-path.decorator';

@Controller('companies')
export class CompaniesController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get('users')
  findByUser(@AuthUser() user: User) {
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
    @Body() companyDetails: CompanyDetailsDTO
  ) {
    return this.commandBus.execute(
      new UpdateCompanyCommand(
        id,
        companyDetails,
        { companyId: user.companyId, id: user.id }
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':id/aboutus')
  updateAboutUs(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body('html') html: string
  ) {
    return this.commandBus.execute(
      new UpdateCompanyAboutUsCommand(
        id,
        html,
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

  @UseGuards(JwtAdminStrategy, MultipartUploadToFilePathStrategy)
  @Patch(':id/logos')
  updateLogo(
    @AuthUser() user: User,
    @Param('id') id: string,
    @MultipartUploadToFilePath() filePath: string
  ) {
    return this.commandBus.execute(
      new UpdateCompanyLogoCommand(
        id,
        filePath,
        { companyId: user.companyId, id: user.id }
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':id/payments')
  updatePayment(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() payment: PaymentDTO
  ) {
    return this.commandBus.execute(
      new UpdateCompanyPaymentCommand(
        id,
        {
          creditCard: payment.creditCard,
          money: payment.money,
          pixKey: payment.pixKey
        },
        {
          companyId: user.companyId,
          id: user.id
        }
      )
    );
  }

}
