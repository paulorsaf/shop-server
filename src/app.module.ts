import { Module } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { FirebaseAdminAppModule } from './firebase-admin-app.module';

@Module({
  imports: [
    CategoriesModule
  ]
})
export class AppModule {}
