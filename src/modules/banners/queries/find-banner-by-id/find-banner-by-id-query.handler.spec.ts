import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { BannerRepositoryMock } from '../../../../mocks/banner-repository.mock';
import { BannerRepository } from '../../repositories/banner.repository';
import { FindBannerByIdQueryHandler } from './find-banner-by-id-query.handler';
import { FindBannerByIdQuery } from './find-banner-by-id.query';
import { ProductRepository } from '../../repositories/product.repository';
import { NotFoundException } from '@nestjs/common';
import { Banner } from '../../entities/banner';

describe('FindBannerByIdQueryHandler', () => {

  let handler: FindBannerByIdQueryHandler;
  let bannerRepository: BannerRepositoryMock;

  let banner: Banner;
  const command = new FindBannerByIdQuery('anyCompanyId', 'anyBannerId');

  beforeEach(async () => {
    banner = {id: "anyBannerId", companyId: "anyCompanyId", productId: "anyProductId"} as any;

    bannerRepository = new BannerRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindBannerByIdQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        BannerRepository,
        ProductRepository
      ]
    })
    .overrideProvider(BannerRepository).useValue(bannerRepository)
    .compile();

    handler = module.get<FindBannerByIdQueryHandler>(FindBannerByIdQueryHandler);
  });

  it('given find banner by id, then return banner', async () => {
    bannerRepository.response = banner;

    const response = await handler.execute(command);

    expect(response).toEqual(banner);
  });

  it('given find banner by id, when banner not found, then throw not found exception', async () => {
    bannerRepository.response = null;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given banner found, when banner doesnt belong to company, then throw not found exception', async () => {
    bannerRepository.response = {id: "anyOtherCompanyId"};

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

});
