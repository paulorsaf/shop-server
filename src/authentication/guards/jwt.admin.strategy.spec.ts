import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationServiceMock } from '../../mocks/authorization-service.mock';
import { UserType } from '../model/user-type';
import { AuthorizationService } from '../services/auth/authorization.service';
import { JwtAdminStrategy } from './jwt.admin.strategy';

describe('JWT Admin Strategy', () => {
  let service: JwtAdminStrategy;
  
  let authorizationService: AuthorizationServiceMock;
  let context: ExecutionContextMock;
  const user = {uid: "userUid", type: UserType.ADMIN};

  beforeEach(async () => {
    authorizationService = new AuthorizationServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorizationService,
        JwtAdminStrategy
      ]
    })
    .overrideProvider(AuthorizationService).useValue(authorizationService)
    .compile();

    service = module.get<JwtAdminStrategy>(JwtAdminStrategy);
  });

  it('given authorization token not present, then return unauthorized exception', async () => {
    context = new ExecutionContextMock("");

    await expect(service.canActivate(<any> context)).rejects.toThrowError(UnauthorizedException);
  });

  it('given authorization token present, when error on getting user, then throw exception', async () => {
    authorizationService.response = Promise.reject(new UnauthorizedException());

    context = new ExecutionContextMock("invalidToken");

    await expect(service.canActivate(<any> context)).rejects.toThrowError(UnauthorizedException);
  });

  it('given authorization token present, when user found is not admin, then throw unauthorized exception', async () => {
    user.type = UserType.CLIENT;
    authorizationService.response = Promise.resolve(user);

    context = new ExecutionContextMock("token");

    await expect(service.canActivate(<any> context)).rejects.toThrowError(UnauthorizedException);
  });

  it('given authorization token present, when user found is admin, then request should be authorized', async () => {
    user.type = UserType.ADMIN;
    authorizationService.response = Promise.resolve(user);

    context = new ExecutionContextMock("token");

    const response = await service.canActivate(<any> context);

    expect(response).toBeTruthy();
  });

  it('given authorization token present, when user found is admin, then add user to request', done => {
    user.type = UserType.ADMIN;
    authorizationService.response = Promise.resolve(user);

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

});