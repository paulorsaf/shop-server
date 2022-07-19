import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { ProductImagesController } from './product-images.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { ProductRepository } from '../products/repositories/product.repository';
import { AddProductImageCommand } from './commands/add-product-image/add-product-image.command';

describe('ProductImagesController', () => {

  let controller: ProductImagesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductImagesController
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

    controller = module.get<ProductImagesController>(ProductImagesController);
  });

  describe('given find products', () => {

    const file = {id: 'anyFile'} as any;

    it('then execute find product command', () => {
      controller.add(user, 'anyProductId', file);
  
      expect(commandBus.executed).toEqual(
        new AddProductImageCommand(
          'anyCompanyId', 'anyProductId', file, 'anyUserId'
        )
      );
    });

  })

});
