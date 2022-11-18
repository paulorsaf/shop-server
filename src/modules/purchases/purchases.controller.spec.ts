import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { PurchasesController } from './purchases.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindPurchasesByUserQuery } from './queries/find-purchases-by-company/find-purchases-by-company.query';
import { FindPurchaseByIdAndCompanyQuery } from './queries/find-purchase-by-id-and-company/find-purchase-by-id-and-company.query';
import { UpdatePurchaseStatusCommand } from './commands/update-purchase-status/update-purchase-status.command';
import { SendPurchaseToSystemCommand } from './commands/send-purchase-to-system/send-purchase-to-system.command';

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

    it('then execute find purchases query', () => {
      controller.find(user);
  
      expect(queryBus.executed).toEqual(
        new FindPurchasesByUserQuery(
          "anyCompanyId"
        )
      );
    });

  })

  describe('given find purchase by id', () => {

    it('then execute find purchase by id query', () => {
      controller.findById(user, "anyPurchaseId");
  
      expect(queryBus.executed).toEqual(
        new FindPurchaseByIdAndCompanyQuery(
          "anyCompanyId",
          "anyPurchaseId"
        )
      );
    });

  })

  describe('given update purchase status', () => {

    it('then execute update purchase status command', () => {
      const status = {status: "anyStatus", reason: "anyReason"};

      controller.updateStatus(user, "anyPurchaseId", status);
  
      expect(commandBus.executed).toEqual(
        new UpdatePurchaseStatusCommand(
          "anyCompanyId",
          "anyPurchaseId",
          status,
          "anyUserId"
        )
      );
    });

  })

  describe('given send purchase to system', () => {

    it('then execute send purchase to system command', () => {
      controller.sendToSystem(user, "anyPurchaseId");
  
      expect(commandBus.executed).toEqual(
        new SendPurchaseToSystemCommand(
          "anyCompanyId",
          "anyPurchaseId",
          "anyUserId"
        )
      );
    });

  })

});
