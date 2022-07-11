export class UserRepositoryMock {
    response: any;

    findByUid() {
      return this.response;
    }
}