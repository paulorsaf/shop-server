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
import { EditPurchaseProductQuantityCommand } from './commands/edit-purchase-product/edit-purchase-product-quantity.command';
import { CancelPurchaseProductCommand } from './commands/cancel-purchase-product/cancel-purchase-product.command';

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

  describe('given edit purchase product', () => {

    it('then execute edit purchase product command', () => {
      controller.editPurchaseProduct(user, "anyPurchaseId", "anyProductId", "anyStockId", 10);
  
      expect(commandBus.executed).toEqual(
        new EditPurchaseProductQuantityCommand(
          "anyCompanyId",
          "anyUserId",
          "anyPurchaseId",
          "anyProductId",
          "anyStockId",
          10
        )
      );
    });

  })

  describe('given cancel purchase product', () => {

    it('then execute cancel purchase product command', () => {
      controller.cancelPurchaseProduct(user, "anyPurchaseId", "anyProductId", "anyStockId");
  
      expect(commandBus.executed).toEqual(
        new CancelPurchaseProductCommand(
          "anyCompanyId",
          "anyUserId",
          "anyPurchaseId",
          "anyProductId",
          "anyStockId"
        )
      );
    });

  })

});
