import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { BannerRepositoryMock } from '../../../../mocks/banner-repository.mock';
import { Banner } from '../../entities/banner';
import { BannerRepository } from '../../repositories/banner.repository';
import { FindBannersByCompanyQueryHandler } from './find-banners-by-company-query.handler';
import { FindBannersByCompanyQuery } from './find-banners-by-company.query';
import { ProductRepository } from '../../repositories/product.repository';

describe('FindBannersByCompanyQueryHandler', () => {

  let handler: FindBannersByCompanyQueryHandler;
  let bannerRepository: BannerRepositoryMock;
  let productRepository: RepositoryMock;

  const command = new FindBannersByCompanyQuery('anyCompanyId');

  beforeEach(async () => {
    bannerRepository = new BannerRepositoryMock();
    productRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindBannersByCompanyQueryHandler
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
    .overrideProvider(ProductRepository).useValue(productRepository)
    .compile();

    handler = module.get<FindBannersByCompanyQueryHandler>(FindBannersByCompanyQueryHandler);
  });

  it('given find banners by company, then return banners with products', async () => {
    const banners = [
      new Banner('anyCompanyId1', 'anyId1', 'anyProductId1'),
      new Banner('anyCompanyId2', 'anyId2', 'anyProductId1')
    ];
    bannerRepository.response = banners;

    const product = {id: "anyProductId"};
    productRepository.response = {id: "anyProductId"};

    const response = await handler.execute(command);

    expect(response).toEqual([{id: "anyId1", product}, {id: "anyId2", product}]);
  });

});
