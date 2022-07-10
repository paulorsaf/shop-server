import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from './../mocks/command-bus.mock';
import { CategoriesController } from './categories.controller';
import { CreateCategoryCommand } from './create-category/commands/create-category.command';
import { CreateCategoryCommandHandler } from './create-category/commands/create-category-command.handler';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryUser } from './entities/category';

describe('CategoriesController', () => {

  let controller: CategoriesController;
  let commandBus: CommandBusMock;

  const createCategoryCommand = new CreateCategoryCommand(
    "any category name",
    new CategoryUser('1', 'any name', 'any@email.com')
  );

  beforeEach(async () => {
    commandBus = new CommandBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CategoriesController
      ],
      imports: [
        CqrsModule,
      ],
      providers: [
        CreateCategoryCommandHandler,
        CategoryRepository
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('given post, then execute create category command', () => {
    controller.create("any category name");

    expect(commandBus.executed).toEqual(createCategoryCommand);
  });

});
