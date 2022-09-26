import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCupomCommandHandler } from './create-cupom.command.handler';
import { CreateCupomCommand } from './create-cupom.command';
import { CupomRepository } from '../../repositories/cupom.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CupomCreatedEvent } from '../../events/cupom-created.event';
import { BadRequestException } from '@nestjs/common';

describe('CreateCupomCommandHandler', () => {

  let handler: CreateCupomCommandHandler;
  let eventBus: EventBusMock;

  const query = new CreateCupomCommand('anyCompanyId', {
    cupom: "anyCupom", amountLeft: 10, expireDate: "anyExpireDate", discount: 15
  }, "anyUserId");
  let cupomRepository: CupomRepositoryMock;

  beforeEach(async () => {
    cupomRepository = new CupomRepositoryMock();
    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CreateCupomCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CupomRepository
      ]
    })
    .overrideProvider(CupomRepository).useValue(cupomRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<CreateCupomCommandHandler>(CreateCupomCommandHandler);
  });

  describe('given cupom', () => {

    beforeEach(() => {
      cupomRepository._findResponse = null;
      cupomRepository._response = "anyCupomId";
    })

    it('then create cupom', async () => {
      await handler.execute(query);
  
      expect(cupomRepository._created).toBeTruthy();
    })

    it('then publish cupom created event', async () => {
      await handler.execute(query);
  
      expect(eventBus.published).toEqual(
        new CupomCreatedEvent(
          "anyCompanyId",
          {
            amountLeft: 10,
            companyId: "anyCompanyId",
            cupom: "ANYCUPOM",
            discount: 15,
            expireDate: "anyExpireDate",
            id: "anyCupomId",
          },
          "anyUserId"
        )
      );
    })

    it('when cupom already exists, then return bad request exception error', async () => {
      cupomRepository._findResponse = {id: "anyCupomId"};

      await expect(handler.execute(query)).rejects.toThrowError(BadRequestException);
    })

  })

});

class CupomRepositoryMock {
  _created = false;
  _response;
  _findResponse;
  create() {
    this._created = true;
    return this._response;
  }
  findByCupom() {
    return this._findResponse;
  }
}