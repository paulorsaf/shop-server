import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { ProductImagesController } from './product-images.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { ProductRepository } from '../products/repositories/product.repository';
import { AddProductImageCommand } from './commands/add-product-image/add-product-image.command';
import { DeleteProductImageCommand } from './commands/delete-product-image/delete-product-image.command';

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

  describe('given add product image', () => {

    const file = {id: 'anyFile'} as any;

    it('then execute add product image command', () => {
      controller.add(user, 'anyProductId', file);
  
      expect(commandBus.executed).toEqual(
        new AddProductImageCommand(
          'anyCompanyId', 'anyProductId', file, 'anyUserId'
        )
      );
    });

  })

  describe('given delete product image', () => {

    it('then execute delete product image command', () => {
      controller.delete(user, 'anyProductId', 'anyFileName');
  
      expect(commandBus.executed).toEqual(
        new DeleteProductImageCommand(
          'anyCompanyId', 'anyProductId', 'anyFileName', 'anyUserId'
        )
      );
    });

  })

});
