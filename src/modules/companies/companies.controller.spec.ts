import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { CompaniesController } from './companies.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindCompanyByIdQuery } from './queries/find-company-by-id/find-company-by-id.query';
import { UpdateCompanyAddressCommand } from './commands/update-company-address/update-company-address.command';
import { UpdateCompanyCommand } from './commands/update-company/update-company.command';

describe('CompaniesController', () => {

  let controller: CompaniesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CompaniesController
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

    controller = module.get<CompaniesController>(CompaniesController);
  });

  describe('given find company by id', () => {

    it('then execute create category query', () => {
      controller.findById(user, "anyName");
  
      expect(queryBus.executed).toEqual(
        new FindCompanyByIdQuery(
          "anyCompanyId", {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  })

  describe('given update company', () => {

    it('then execute update company command', () => {
      controller.update(user, "anyCompanyId", "anyName");
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyCommand(
          "anyCompanyId",
          {name: "anyName"},
          {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  });

  describe('given update company address', () => {

    it('then execute update company address command', () => {
      const address = {id: "anyAddress"} as any;

      controller.updateAddress(user, "anyCompanyId", address);
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyAddressCommand(
          "anyCompanyId",
          address,
          {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  })

});
