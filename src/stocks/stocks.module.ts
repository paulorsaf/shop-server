import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../authentication/authentication.module';
import { StocksController } from './stocks.controller';

@Module({
  controllers: [
    StocksController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
  ]
})
export class StocksModule {}
