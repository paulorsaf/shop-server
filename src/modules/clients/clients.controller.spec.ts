import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { ClientsController } from './clients.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindClientsByCompanyQuery } from './queries/find-clients-by-company/find-clients-by-company.query';

describe('ClientsController', () => {

  let controller: ClientsController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ClientsController
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

    controller = module.get<ClientsController>(ClientsController);
  });

  describe('given find clients', () => {

    it('then execute find clients by company query', () => {
      controller.findById(user);
  
      expect(queryBus.executed).toEqual(
        new FindClientsByCompanyQuery(
          "anyCompanyId"
        )
      );
    });

  })

});
