import { Test, TestingModule } from '@nestjs/testing';
import { AddressController } from './address.controller';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindAddressByZipcodeQuery } from './queries/find-address-by-zipcode/find-address-by-zipcode.query';

describe('AddressController', () => {
  
  let controller: AddressController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<AddressController>(AddressController);
  });

  it('given find address by zip code, then execute find address by zip code query', async () => {
    await controller.findByZipCode("anyZipCode");

    expect(queryBus.executed).toEqual(
      new FindAddressByZipcodeQuery(
        "anyZipCode"
      )
    )
  })

});

