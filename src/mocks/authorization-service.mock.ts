export class AuthorizationServiceMock {
    response: any;
    
    findByToken(token: string) {
      return this.response;
    }
}