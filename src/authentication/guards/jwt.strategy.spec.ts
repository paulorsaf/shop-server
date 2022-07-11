import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationService } from '../services/auth/authorization.service';
import { JwtStrategy } from './jwt.strategy';

describe('JWT Strategy', () => {
  let service: JwtStrategy;
  
  let authorizationService: AuthorizationServiceMock;
  let context: ExecutionContextMock;
  const user = {uid: "userUid"};

  beforeEach(async () => {
    authorizationService = new AuthorizationServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        JwtStrategy
      ]
    })
    .overrideProvider(AuthorizationService).useValue(authorizationService)
    .compile();

    service = module.get<JwtStrategy>(JwtStrategy);
  });

  it('given authorization token not present, then return unauthorized exception', async () => {
    context = new ExecutionContextMock("");

    await expect(service.canActivate(<any> context)).rejects.toThrowError(UnauthorizedException);
  });

  it('given authorization token present, when error on getting user, then return unauthorized exception', async () => {
    context = new ExecutionContextMock("invalidToken");

    await expect(service.canActivate(<any> context)).rejects.toThrowError(UnauthorizedException);
  });

  it('given authorization token present, when user found, then request should be authorized', async () => {
    context = new ExecutionContextMock("token");

    const response = await service.canActivate(<any> context);

    expect(response).toBeTruthy();
  });

  it('given authorization token present, when user found, then add user to request', done => {
    context = new ExecutionContextMock("token");

    service.canActivate(<any> context).then(() => {
      expect(context._request.request.user).toEqual(user);
      done();
    });
  });

  class ExecutionContextMock {
    _authorization = "";
    _request: RequestMock;

    constructor(token: string) {
      this._authorization = token;
    }

    switchToHttp() {
      this._request = new RequestMock(this._authorization);
      return this._request;
    }
  }

  class RequestMock {
    _authorization = "";
    request: any;

    constructor(token: string) {
      this._authorization = token;
    }

    getRequest() {
      this.request = {
        headers: {
          authorization: this._authorization,
        },
        user: null
      }
      return this.request;
    }
  }

  class AuthorizationServiceMock {
    findByToken(token: string) {
      if (token == "invalidToken") {
        return Promise.reject();
      }
      return Promise.resolve(user);
    }
  }

});