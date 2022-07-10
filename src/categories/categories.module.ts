import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryCommandHandler } from './create-category/commands/create-category-command.handler';
import { CategoryCreatedEventHandler } from './create-category/events/category-created-event.handler';
import { FirebaseAdminAppModule } from 'src/firebase-admin-app.module';

@Module({
  controllers: [
    CategoriesController
  ],
  imports: [
    CqrsModule
  ],
  providers: [
    CreateCategoryCommandHandler,
    CategoryCreatedEventHandler,
    CategoryRepository
  ]
})
export class CategoriesModule {}
