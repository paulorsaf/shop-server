import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { ProductsController } from './products.controller';
import { ProductRepository } from './repositories/product.repository';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindProductsByCompanyQuery } from './queries/find-by-company/find-products-by-company.query';
import { CreateProductCommand } from './commands/create-product/create-product.command';
import { CreateProductDTO } from './commands/create-product/dtos/create-product.dto';
import { FindProductByIdQuery } from './queries/find-by-id/find-product-by-id.query';
import { UpdateProductCommand } from './commands/update-product/update-product.command';
import { UpdateProductDTO } from './commands/update-product/dtos/update-product.dto';
import { DeleteProductCommand } from './commands/delete-product/delete-product.command';
import { ChangeProductVisibilityCommand } from './commands/change-product-visibility/change-product-visibility.command';

describe('ProductsController', () => {

  let controller: ProductsController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const internalId = "anyInternalId";
  const productId = 'anyProductId';
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
      controller.find(user, "1", internalId);
  
      expect(queryBus.executed).toEqual(
        new FindProductsByCompanyQuery(user.companyId, 1, internalId)
      );
    });

  })

  describe('given find product by id', () => {

    it('then execute find product by id command', () => {
      controller.findById(user, 'productId');
  
      expect(queryBus.executed).toEqual(
        new FindProductByIdQuery(
          user.companyId, 'productId'
        )
      );
    });

  })

  describe('given save product', () => {

    const product = new CreateProductDTO("anyName", "anyCategoryId", 10, 5, 1, "anyUnit");

    it('then execute save product command', () => {
      controller.save(user, product);
  
      expect(commandBus.executed).toEqual(
        new CreateProductCommand(
          product, user.companyId, user.id
        )
      );
    });

  })

  describe('given update product', () => {

    const product = new UpdateProductDTO(
      productId, "anyName", "anyCategoryId", 10, 5, 'anyDescription', 1
    );

    it('then execute update product command', () => {
      controller.update(user, productId, product);
  
      expect(commandBus.executed).toEqual(
        new UpdateProductCommand(
          {...product, id: productId}, user.companyId, user.id
        )
      );
    });

  })

  describe('given delete product', () => {

    it('then execute update product command', () => {
      controller.delete(user, productId);
  
      expect(commandBus.executed).toEqual(
        new DeleteProductCommand(
          productId, user.id, user.companyId
        )
      );
    });

  })

  describe('given change product visibility', () => {

    it('then execute change product visibility command', () => {
      controller.changeVisibility(user, productId);
  
      expect(commandBus.executed).toEqual(
        new ChangeProductVisibilityCommand(
          user.companyId, user.id, productId
        )
      );
    });

  })

});
