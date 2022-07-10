import { Controller, Post, Body } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCategoryCommand } from './create-category/commands/create-category.command';

@Controller('categories')
export class CategoriesController {
  
  constructor(
    private commandBus: CommandBus
  ) {}

  @Post()
  create(@Body("name") name: string) {
    return this.commandBus.execute(
      new CreateCategoryCommand(name)
    );
  }

}
