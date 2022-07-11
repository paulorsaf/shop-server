import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from './../mocks/command-bus.mock';
import { CategoriesController } from './categories.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryUser } from './entities/category';
import { User } from '../authentication/model/user';
import { AuthenticationModule } from '../authentication/authentication.module';
import { QueryBusMock } from '../mocks/query-bus.mock';
import { CreateCategoryCommandHandler } from './commands/create-category/create-category-command.handler';
import { CreateCategoryCommand } from './commands/create-category/create-category.command';
import { FindByCompanyQuery } from './queries/find-categories/find-by-company.query';

describe('CategoriesController', () => {

  let controller: CategoriesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: '1', name: "any name", email: "any@email.com", companyId: 'anyId'};

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
      "any category name",
      user.companyId,
      new CategoryUser(user.id, user.name, user.email)
    );

    it('then execute create category command', () => {
      controller.create(user, "any category name");
  
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

});
