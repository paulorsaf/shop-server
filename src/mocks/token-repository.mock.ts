export class TokenRepositoryMock {
    response: any;

    verifyToken() {
      return this.response;
    }
}