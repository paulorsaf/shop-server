import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { CupomsController } from './cupoms.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindCupomsByCompanyQuery } from './queries/find-cupoms-by-company/find-cupoms-by-company.query';
import { CreateCupomCommand } from './commands/create-cupom/create-cupom.command';
import { CreateCupomDTO } from './dtos/create-cupom.dto';

describe('CupomsController', () => {

  let controller: CupomsController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CupomsController
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

    controller = module.get<CupomsController>(CupomsController);
  });

  describe('given find cupoms', () => {

    it('then execute find cupoms query', () => {
      controller.find(user);
  
      expect(queryBus.executed).toEqual(
        new FindCupomsByCompanyQuery(
          "anyCompanyId"
        )
      );
    });

  })

  describe('given create cupom', () => {

    it('then execute create cupom command', () => {
      const createCupomDTO: CreateCupomDTO = {
        cupom: "anyCupomId",
        amountLeft: 10,
        expireDate: "anyExpireDate"
      }

      controller.create(user, createCupomDTO);
  
      expect(commandBus.executed).toEqual(
        new CreateCupomCommand(
          "anyCompanyId",
          createCupomDTO,
          "anyUserId"
        )
      );
    });

  })

});
