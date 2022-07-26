import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { DeleteBannerDetailCommand } from './delete-banner-detail.command';
import { DeleteBannerDetailCommandHandler } from './delete-banner-detail-command.handler';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { BannerRepository } from '../../repositories/banner.repository';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { BannerDetailDeletedEvent } from './events/banner-detail-deleted.event';

describe('DeleteBannerDetailCommandHandler', () => {

  let handler: DeleteBannerDetailCommandHandler;
  let bannerRepository: RepositoryMock;
  let eventBus: EventBusMock;

  const command = new DeleteBannerDetailCommand(
    'anyCompanyId', 'anyBannerId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    bannerRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteBannerDetailCommandHandler
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

    handler = module.get<DeleteBannerDetailCommandHandler>(DeleteBannerDetailCommandHandler);

    bannerRepository.response = {companyId: "anyCompanyId"};
  });

  it('given delete banner, then delete banner', async () => {
    await handler.execute(command);

    expect(bannerRepository.deletedWith).toEqual('anyBannerId');
  });

  it('given delete banner, when banner not found, then throw not found exception', async () => {
    bannerRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given delete banner, when banner doesnt belong to company, then throw unauthorized exception', async () => {
    bannerRepository.response = {companyId: "anyOtherCompanyId"};

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

  it('given banner deleted, then publish banner deleted event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new BannerDetailDeletedEvent(
        "anyCompanyId", "anyBannerId", "anyUserId"
      )
    );
  });

});
