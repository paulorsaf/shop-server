import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../mocks/command-bus.mock';
import { User } from '../authentication/model/user';
import { AuthenticationModule } from '../authentication/authentication.module';
import { QueryBusMock } from '../mocks/query-bus.mock';
import { StocksController } from './stocks.controller';
import { FindStockByProductQuery } from './queries/find-stock-by-product/find-stock-by-product.query';
import { AddStockOption } from './dtos/add-stock-option';
import { AddStockOptionCommand } from './commands/add-stock-option/add-stock-option.command';

describe('StocksController', () => {

  let controller: StocksController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        StocksController
      ],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<StocksController>(StocksController);
  });

  describe('given find stock by product', () => {

    it('then execute find stock by product query', () => {
      controller.find(user, "anyProductId");
  
      expect(queryBus.executed).toEqual(
        new FindStockByProductQuery(user.companyId, "anyProductId")
      );
    });

  })

  describe('given add stock option', () => {

    const addStockOption: AddStockOption = {quantity: 10};

    it('then execute add stock option command', () => {
      controller.save(user, "anyProductId", addStockOption);
  
      expect(commandBus.executed).toEqual(
        new AddStockOptionCommand(
          user.companyId, "anyProductId", addStockOption, user.id
        )
      );
    });

  })

});
