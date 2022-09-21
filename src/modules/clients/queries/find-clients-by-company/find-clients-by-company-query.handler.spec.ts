import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ClientRepository } from '../../repositories/client.repository';
import { FindClientsByCompanyQueryHandler } from './find-clients-by-company-query.handler';
import { FindClientsByCompanyQuery } from './find-clients-by-company.query';

describe('FindClientsByCompanyQueryHandler', () => {

  let handler: FindClientsByCompanyQueryHandler;
  let clientRepository: ClientRepositoryMock;

  const command = new FindClientsByCompanyQuery('anyCompanyId');

  beforeEach(async () => {
    clientRepository = new ClientRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindClientsByCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ClientRepository
      ]
    })
    .overrideProvider(ClientRepository).useValue(clientRepository)
    .compile();

    handler = module.get<FindClientsByCompanyQueryHandler>(FindClientsByCompanyQueryHandler);
  });

  it('given find users by company, then return users', async () => {
    const users = [{id: "anyUser1"}, {id: "anyUser2"}];
    clientRepository._response = users;

    const response = await handler.execute(command);

    expect(response).toEqual(users);
  });

});

class ClientRepositoryMock {
  _response;
  findByCompany() {
    return this._response;
  }
}