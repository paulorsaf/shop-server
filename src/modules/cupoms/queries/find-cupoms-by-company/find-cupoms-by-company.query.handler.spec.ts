import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { FindCupomsByCompanyQueryHandler } from './find-cupoms-by-company.query.handler';
import { FindCupomsByCompanyQuery } from './find-cupoms-by-company.query';
import { CupomRepository } from '../../repositories/cupom.repository';

describe('FindCupomsByCompanyQueryHandler', () => {

  let handler: FindCupomsByCompanyQueryHandler;

  const query = new FindCupomsByCompanyQuery('anyCompanyId');
  let cupomRepository: CupomRepositoryMock;

  beforeEach(async () => {
    cupomRepository = new CupomRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindCupomsByCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CupomRepository
      ]
    })
    .overrideProvider(CupomRepository).useValue(cupomRepository)
    .compile();

    handler = module.get<FindCupomsByCompanyQueryHandler>(FindCupomsByCompanyQueryHandler);
  });

  it('given cupoms found, then return cupoms', async () => {
    const cupoms = [{id: 1}, {id: 2}] as any;
    cupomRepository._response = cupoms;

    const response = await handler.execute(query);

    expect(response).toEqual(cupoms);
  })

});

class CupomRepositoryMock {
  _response;
  find() {
    return this._response;
  }
}