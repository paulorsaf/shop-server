import { Controller, UseGuards, Get, Body, Post, Param, Patch, Delete } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtAdminStrategy } from '../../authentication/guards/jwt.admin.strategy';
import { User } from '../../authentication/model/user';
import { SaveBannerDetailDTO } from './commands/dtos/save-banner-detail.dto';
import { CreateBannerDetailCommand } from './commands/create-banner-detail/create-banner-detail.command';
import { FindBannersByCompanyQuery } from './queries/find-banners-by-company/find-banners-by-company.query';
import { FindBannerByIdQuery } from './queries/find-banner-by-id/find-banner-by-id.query';
import { UpdateBannerDetailCommand } from './commands/update-banner-detail/update-banner-detail.command';
import { DeleteBannerDetailCommand } from './commands/delete-banner-detail/delete-banner-detail.command';

@Controller('banners')
export class BannersController {
  
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(JwtAdminStrategy)
  @Get()
  find(@AuthUser() user: User) {
    return this.queryBus.execute(
      new FindBannersByCompanyQuery(user.companyId)
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Get(':bannerId')
  findById(@AuthUser() user: User, @Param('bannerId') bannerId: string) {
    return this.queryBus.execute(
      new FindBannerByIdQuery(
        user.companyId, bannerId
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Post()
  save(@AuthUser() user: User, @Body() banner: SaveBannerDetailDTO) {
    return this.commandBus.execute(
      new CreateBannerDetailCommand(
        user.companyId, banner.productId, user.id
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Patch(':bannerId')
  update(
    @AuthUser() user: User,
    @Param('bannerId') bannerId: string,
    @Body() banner: SaveBannerDetailDTO
  ) {
    return this.commandBus.execute(
      new UpdateBannerDetailCommand(
        user.companyId, {
          id: bannerId, productId: banner.productId
        }, user.id
      )
    );
  }

  @UseGuards(JwtAdminStrategy)
  @Delete(':bannerId')
  delete(
    @AuthUser() user: User,
    @Param('bannerId') bannerId: string
  ) {
    return this.commandBus.execute(
      new DeleteBannerDetailCommand(
        user.companyId, bannerId, user.id
      )
    );
  }

}
