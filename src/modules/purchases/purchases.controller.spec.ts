import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { PurchasesController } from './purchases.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindPurchasesByUserQuery } from './queries/find-purchases-by-company/find-purchases-by-company.query';

describe('PurchasesController', () => {

  let controller: PurchasesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PurchasesController
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

    controller = module.get<PurchasesController>(PurchasesController);
  });

  describe('given find purchases', () => {

    it('then execute find purchases command', () => {
      controller.find(user);
  
      expect(queryBus.executed).toEqual(
        new FindPurchasesByUserQuery(
          "anyCompanyId"
        )
      );
    });

  })

});
