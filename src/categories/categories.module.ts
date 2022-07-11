import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryRepository } from './repositories/category.repository';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CreateCategoryCommandHandler } from './commands/create-category/create-category-command.handler';
import { CategoryCreatedEventHandler } from './commands/create-category/events/category-created-event.handler';
import { FindByCompanyQueryHandler } from './queries/find-categories/find-by-company-query.handler';

@Module({
  controllers: [
    CategoriesController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    CreateCategoryCommandHandler,
    CategoryCreatedEventHandler,
    CategoryRepository,
    FindByCompanyQueryHandler
  ]
})
export class CategoriesModule {}
