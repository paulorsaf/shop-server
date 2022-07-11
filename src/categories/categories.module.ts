import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryRepository } from './repositories/category.repository';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CreateCategoryCommandHandler } from './commands/create-category/create-category-command.handler';
import { CategoryCreatedEventHandler } from './commands/create-category/events/category-created-event.handler';
import { FindByCompanyQueryHandler } from './queries/find-by-company/find-category-by-company-query.handler';
import { FindCategoryByIdQueryHandler } from './queries/find-by-id/find-category-by-id-query.handler';
import { UpdateCategoryCommandHandler } from './commands/update-category/update-category-command.handler';
import { CategoryUpdatedEventHandler } from './commands/update-category/events/category-updated-event.handler';

@Module({
  controllers: [
    CategoriesController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    CategoryRepository,

    CreateCategoryCommandHandler,
    UpdateCategoryCommandHandler,

    CategoryCreatedEventHandler,
    CategoryUpdatedEventHandler,
    
    FindByCompanyQueryHandler,
    FindCategoryByIdQueryHandler
  ]
})
export class CategoriesModule {}
