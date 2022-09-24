import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateCupomCommandHandler } from './create-cupom.command.handler';
import { CreateCupomCommand } from './create-cupom.command';
import { CupomRepository } from '../../repositories/cupom.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CupomCreatedEvent } from '../../events/cupom-created.event';

describe('CreateCupomCommandHandler', () => {

  let handler: CreateCupomCommandHandler;
  let eventBus: EventBusMock;

  const query = new CreateCupomCommand('anyCompanyId', {
    cupom: "anyCupom"
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

  describe('given execute command with success', () => {

    beforeEach(() => {
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
            companyId: "anyCompanyId",
            cupom: "anyCupom",
            id: "anyCupomId"
          },
          "anyUserId"
        )
      );
    })

  })

});

class CupomRepositoryMock {
  _created = false;
  _response;
  create() {
    this._created = true;
    return this._response;
  }
}