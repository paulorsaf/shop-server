import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from './authorization.service';
import { UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user/user.repository';
import { User } from '../../model/user';
import { TokenRepository } from '../../repositories/token/token.repository';
import { UserRepositoryMock } from '../../../mocks/user-repository.mock';
import { TokenRepositoryMock } from '../../../mocks/token-repository.mock';

describe('AuthorizationService', () => {
  let service: AuthorizationService;

  let tokenRepository: TokenRepositoryMock;
  let userRepository: UserRepositoryMock;

  beforeEach(async () => {
    tokenRepository = new TokenRepositoryMock();
    userRepository = new UserRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        TokenRepository,
        UserRepository
      ]
    })
    .overrideProvider(TokenRepository).useValue(tokenRepository)
    .overrideProvider(UserRepository).useValue(userRepository)
    .compile();

    service = module.get<AuthorizationService>(AuthorizationService);
  });

  it('given valid token, when find user by token is successful, then return user', async () => {
    const user = createUser();
    
    tokenRepository.response = Promise.resolve({sub: '1'});
    userRepository.response = Promise.resolve(user);

    const response = await service.findByToken("token");
    expect(response).toEqual(user);
  });

  it('given valid token, when user not found, then throw not found exception', async () => {
    tokenRepository.response = Promise.resolve({sub: '1'});
    userRepository.response = Promise.resolve(null);

    await expect(service.findByToken("notFoundToken")).rejects.toThrowError(UnauthorizedException);
  });

  it('given invalid token, then throw unauthorized exception', async () => {
    tokenRepository.response = Promise.reject({error: 'error'});

    await expect(service.findByToken("invalidToken")).rejects.toThrowError(UnauthorizedException);
  })

  function createUser() : User {
    const user = new User();
    user.email = "any@email.com";
    user.name = "anyName";
    return user;
  }

});