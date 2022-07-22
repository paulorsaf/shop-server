import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { BannersController } from './banners.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindBannersByCompanyQuery } from './queries/find-banners-by-company/find-banners-by-company.query';

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

  describe('given find banners', () => {

    const query = new FindBannersByCompanyQuery(
      "anyCompanyId"
    );

    it('then execute create category command', () => {
      controller.find(user);
  
      expect(queryBus.executed).toEqual(query);
    });

  })

});
