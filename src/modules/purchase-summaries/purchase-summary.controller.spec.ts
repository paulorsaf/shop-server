import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { PurchaseSummaryController } from './purchase-summary.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindDailyPurchaseSummariesQuery } from './queries/find-daily-purchase-summaries/find-daily-purchase-summaries.query';

describe('PurchaseSummaryController', () => {

  let controller: PurchaseSummaryController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PurchaseSummaryController
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

    controller = module.get<PurchaseSummaryController>(PurchaseSummaryController);
  });

  describe('given find company by id', () => {

    it('then execute create category query', () => {
      controller.findDaily(user, "from", "until");
  
      expect(queryBus.executed).toEqual(
        new FindDailyPurchaseSummariesQuery(
          "anyCompanyId",
          "from",
          "until"
        )
      );
    });

  })

});
