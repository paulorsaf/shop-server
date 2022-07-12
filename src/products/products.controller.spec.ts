import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../mocks/command-bus.mock';
import { ProductsController } from './products.controller';
import { ProductRepository } from './repositories/product.repository';
import { User } from '../authentication/model/user';
import { AuthenticationModule } from '../authentication/authentication.module';
import { QueryBusMock } from '../mocks/query-bus.mock';
import { FindProductsByCompanyQuery } from './queries/find-by-company/find-products-by-company.query';

describe('ProductsController', () => {

  let controller: ProductsController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductsController
      ],
      imports: [
        CqrsModule,
        AuthenticationModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  describe('given find products', () => {

    it('then execute find product command', () => {
      controller.find(user);
  
      expect(queryBus.executed).toEqual(
        new FindProductsByCompanyQuery(user.companyId)
      );
    });

  })

});
