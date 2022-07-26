import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { BannersController } from './banners.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindBannersByCompanyQuery } from './queries/find-banners-by-company/find-banners-by-company.query';
import { CreateBannerDetailCommand } from './commands/create-banner-detail/create-banner-detail.command';
import { FindBannerByIdQuery } from './queries/find-banner-by-id/find-banner-by-id.query';
import { UpdateBannerDetailCommand } from './commands/update-banner-detail/update-banner-detail.command';
import { DeleteBannerDetailCommand } from './commands/delete-banner-detail/delete-banner-detail.command';

describe('BannersController', () => {

  let controller: BannersController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        BannersController
      ],
      imports: [
        CqrsModule,
        AuthenticationModule
      ],
      providers: [
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<BannersController>(BannersController);
  });

  describe('given find banners by company', () => {

    it('then execute find banners by company command', () => {
      controller.find(user);
  
      expect(queryBus.executed).toEqual(
        new FindBannersByCompanyQuery(
          "anyCompanyId"
        )
      );
    });

  })

  describe('given find banner by id', () => {

    it('then execute find banner by id command', () => {
      controller.findById(user, "anyBannerId");
  
      expect(queryBus.executed).toEqual(
        new FindBannerByIdQuery(
          "anyCompanyId", "anyBannerId"
        )
      );
    });

  })

  describe('given save banner detail', () => {

    it('then execute save banner detail command', () => {
      controller.save(user, {productId: "anyProductId"});
  
      expect(commandBus.executed).toEqual(
        new CreateBannerDetailCommand(
          "anyCompanyId", "anyProductId", "anyUserId"
        )
      );
    });

  })

  describe('given update banner detail', () => {

    it('then execute update banner detail command', () => {
      controller.update(user, "anyBannerId", {productId: "anyProductId"});
  
      expect(commandBus.executed).toEqual(
        new UpdateBannerDetailCommand(
          "anyCompanyId", {
            id: "anyBannerId", productId: "anyProductId"
          }, "anyUserId"
        )
      );
    });

  })

  describe('given delete banner detail', () => {

    it('then execute delete banner detail command', () => {
      controller.delete(user, "anyBannerId");
  
      expect(commandBus.executed).toEqual(
        new DeleteBannerDetailCommand(
          "anyCompanyId", "anyBannerId", "anyUserId"
        )
      );
    });

  })

});
