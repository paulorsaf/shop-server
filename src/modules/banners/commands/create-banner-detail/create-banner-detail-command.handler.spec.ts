import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CreateBannerDetailCommand } from './create-banner-detail.command';
import { CreateBannerDetailCommandHandler } from './create-banner-detail-command.handler';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { BannerRepository } from '../../repositories/banner.repository';
import { BannerDetailCreatedEvent } from './events/banner-detail-created.event';

describe('CreateBannerDetailCommandHandler', () => {

  let handler: CreateBannerDetailCommandHandler;
  let bannerRepository: RepositoryMock;
  let eventBus: EventBusMock;

  const command = new CreateBannerDetailCommand(
    'anyCompanyId', 'anyProductId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    bannerRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CreateBannerDetailCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        BannerRepository
      ]
    })
    .overrideProvider(BannerRepository).useValue(bannerRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<CreateBannerDetailCommandHandler>(CreateBannerDetailCommandHandler);

    bannerRepository.response = 'anyBannerId';
  });

  it('given create banner, then save banner', async () => {
    await handler.execute(command);

    expect(bannerRepository.savedWith).toEqual({
      companyId: 'anyCompanyId', productId: 'anyProductId', createdBy: 'anyUserId'
    })
  });

  it('given banner created, then publish banner created event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new BannerDetailCreatedEvent(
        'anyCompanyId', {
          id: 'anyBannerId', productId: 'anyProductId'
        }, 'anyUserId'
      )
    )
  });

});
