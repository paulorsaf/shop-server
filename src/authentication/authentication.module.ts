import { Module } from '@nestjs/common';
import { JwtAdminStrategy } from './guards/jwt.admin.strategy';
import { TokenRepository } from './repositories/token/token.repository';
import { UserRepository } from './repositories/user/user.repository';
import { AuthorizationService } from './services/auth/authorization.service';

@Module({
  exports: [
    AuthorizationService,
    TokenRepository,
    UserRepository,
    JwtAdminStrategy
  ],
  providers: [
    AuthorizationService,
    TokenRepository,
    UserRepository,
    JwtAdminStrategy
  ]
})
export class AuthenticationModule {}
