import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BannerRepositoryMock } from '../../../../mocks/banner-repository.mock';
import { Banner } from '../../entities/banner';
import { BannerRepository } from '../../repositories/banner.repository';
import { FindBannersByCompanyQueryHandler } from './find-banners-by-company-query.handler';
import { FindBannersByCompanyQuery } from './find-banners-by-company.query';

describe('FindBannersByCompanyQueryHandler', () => {

  let handler: FindBannersByCompanyQueryHandler;
  let bannerRepository: BannerRepositoryMock;

  const command = new FindBannersByCompanyQuery('anyCompanyId');

  beforeEach(async () => {
    bannerRepository = new BannerRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindBannersByCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        BannerRepository
      ]
    })
    .overrideProvider(BannerRepository).useValue(bannerRepository)
    .compile();

    handler = module.get<FindBannersByCompanyQueryHandler>(FindBannersByCompanyQueryHandler);
  });

  it('given execute handler, then find categories by company', async () => {
    const banners = [
      new Banner('annyBannerId1', 'anyProductId1'),
      new Banner('annyBannerId2', 'anyProductId1')
    ];
    bannerRepository.response = banners;

    const response = await handler.execute(command);

    expect(response).toEqual(banners);
  });

});
