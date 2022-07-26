import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateBannerDetailCommand } from './update-banner-detail.command';
import { UpdateBannerDetailCommandHandler } from './update-banner-detail-command.handler';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { BannerRepository } from '../../repositories/banner.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BannerDetailUpdatedEvent } from './events/banner-detail-updated.event';

describe('UpdateBannerDetailCommandHandler', () => {

  let handler: UpdateBannerDetailCommandHandler;
  let bannerRepository: RepositoryMock;
  let eventBus: EventBusMock;

  const command = new UpdateBannerDetailCommand(
    'anyCompanyId', {
      id: 'anyBannerId', productId: 'anyProductId'
    }, 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    bannerRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateBannerDetailCommandHandler
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

    handler = module.get<UpdateBannerDetailCommandHandler>(UpdateBannerDetailCommandHandler);

    bannerRepository.response = {companyId: "anyCompanyId"};
  });

  it('given update banner, then update banner', async () => {
    await handler.execute(command);

    expect(bannerRepository.updatedWith).toEqual({
      id: 'anyBannerId', productId: 'anyProductId', updatedBy: 'anyUserId'
    })
  });

  it('given update banner, when banner not found, then throw not found exception', async () => {
    bannerRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given update banner, when banner doesnt belong to company, then throw unauthorized exception', async () => {
    bannerRepository.response = {companyId: "anyOtherCompanyId"};

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

  it('given banner updated, then publish banner updated event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new BannerDetailUpdatedEvent(
        "anyCompanyId", {
          id: "anyBannerId", productId: "anyProductId"
        }, "anyUserId"
      )
    );
  });

});
