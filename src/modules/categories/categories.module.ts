import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryRepository } from './repositories/category.repository';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CreateCategoryCommandHandler } from './commands/create-category/create-category-command.handler';
import { CategoryCreatedEventHandler } from './commands/create-category/events/category-created-event.handler';
import { FindByCompanyQueryHandler } from './queries/find-by-company/find-category-by-company-query.handler';
import { FindCategoryByIdQueryHandler } from './queries/find-by-id/find-category-by-id-query.handler';
import { UpdateCategoryCommandHandler } from './commands/update-category/update-category-command.handler';
import { CategoryUpdatedEventHandler } from './commands/update-category/events/category-updated-event.handler';
import { DeleteCategoryCommandHandler } from './commands/delete-category/delete-category-command.handler';
import { CategoryDeletedEventHandler } from './commands/delete-category/events/category-deleted-event.handler';
import { EventRepository } from '../../repositories/event.repository';

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
    EventRepository,

    CreateCategoryCommandHandler,
    UpdateCategoryCommandHandler,
    DeleteCategoryCommandHandler,

    CategoryCreatedEventHandler,
    CategoryUpdatedEventHandler,
    CategoryDeletedEventHandler,

    FindByCompanyQueryHandler,
    FindCategoryByIdQueryHandler
  ]
})
export class CategoriesModule {}
