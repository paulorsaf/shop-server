import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from './../../mocks/command-bus.mock';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from './repositories/category.repository';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { CreateCategoryCommandHandler } from './commands/create-category/create-category-command.handler';
import { CreateCategoryCommand } from './commands/create-category/create-category.command';
import { FindByCompanyQuery } from './queries/find-by-company/find-category-by-company.query';
import { FindCategoryByIdQuery } from './queries/find-by-id/find-category-by-id.query';
import { UpdateCategoryCommand } from './commands/update-category/update-category.command';
import { DeleteCategoryCommand } from './commands/delete-category/delete-category.command';
import { UpdateCategoryVisibilityCommand } from './commands/update-category-visibility/update-category-visibility.command';

describe('CategoriesController', () => {

  let controller: CategoriesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoriesController
      ],
      imports: [
        CqrsModule,
        AuthenticationModule
      ],
      providers: [
        CreateCategoryCommandHandler,
        CategoryRepository
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('given create category', () => {

    const createCategoryCommand = new CreateCategoryCommand(
      "anyName", "anyCompanyId", "anyUserId"
    );

    it('then execute create category command', () => {
      controller.create(user, "anyName");
  
      expect(commandBus.executed).toEqual(createCategoryCommand);
    });

  })

  describe('given find categories', () => {

    it('then execute find categories command', () => {
      controller.find(user);
  
      expect(queryBus.executed).toEqual(
        new FindByCompanyQuery(user.companyId)
      );
    });

  })

  describe('given find category by id', () => {

    it('then execute find category by id command', () => {
      controller.findById(user, 'categoryId');
  
      expect(queryBus.executed).toEqual(
        new FindCategoryByIdQuery(user.companyId, 'categoryId')
      );
    });

  })

  describe('given update category', () => {

    it('then execute update category command', () => {
      controller.update(user, 'categoryId', 'updatedCategoryName');
  
      expect(commandBus.executed).toEqual(
        new UpdateCategoryCommand(
          'categoryId', 'updatedCategoryName', user.id, user.companyId
        )
      );
    });

  })

  describe('given delete category', () => {

    it('then execute delete category command', () => {
      controller.delete(user, 'categoryId');
  
      expect(commandBus.executed).toEqual(
        new DeleteCategoryCommand(
          'categoryId', user.id, user.companyId
        )
      );
    });

  })

  describe('given update visibility', () => {

    it('then execute update category visibility command', () => {
      controller.updateVisibility(user, 'categoryId');
  
      expect(commandBus.executed).toEqual(
        new UpdateCategoryVisibilityCommand(
          user.id, user.companyId, 'categoryId'
        )
      );
    });

  })

});
