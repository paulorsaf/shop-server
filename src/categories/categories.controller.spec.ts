import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from './../mocks/command-bus.mock';
import { CategoriesController } from './categories.controller';
import { CreateCategoryCommand } from './create-category/commands/create-category.command';
import { CreateCategoryCommandHandler } from './create-category/commands/create-category-command.handler';
import { CategoryRepository } from './repositories/category.repository';

describe('CategoriesController', () => {

  let controller: CategoriesController;
  let commandBus: CommandBusMock;

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
    controller.create("name");

    expect(commandBus.executed).toEqual(new CreateCategoryCommand("name"));
  });

});
