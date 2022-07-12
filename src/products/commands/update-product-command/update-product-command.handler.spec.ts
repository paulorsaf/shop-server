import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../mocks/event-bus.mock';
import { UpdateProductCommand } from './update-product.command';
import { UpdateProductCommandHandler } from './update-product-command.handler';
import { ProductRepository } from '../../repositories/product.repository';
import { RepositoryMock } from '../../../mocks/repository.mock';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ProductUpdatedEvent } from './events/product-updated.event';

describe('UpdateProductCommandHandler', () => {

  let handler: UpdateProductCommandHandler;
  let productRepository: RepositoryMock;
  let eventBus: EventBusMock;

  const productDto = new UpdateProductDTO(
    'anyProductId', 'anyName', 'anyCategoryId', 10, 8
  )
  const command = new UpdateProductCommand(
    productDto, 'anyCompanyId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    productRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateProductCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<UpdateProductCommandHandler>(UpdateProductCommandHandler);

    productRepository.response = {id: 1, companyId: "anyCompanyId"};
  });

  it('given execute handler, then save product', async () => {
    await handler.execute(command);

    expect(productRepository.updatedWith).toEqual({
      ...command,
      ...command.product
    })
  });

  it('given execute handler, when product not found, then return not found exception', async () => {
    productRepository.response = Promise.resolve(null);

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given execute handler, when product doesnt belong to company, then return not found exception', async () => {
    productRepository.response = Promise.resolve({companyId: "anyOtherCompanyId"});

    await expect(handler.execute(command)).rejects.toThrowError(UnauthorizedException);
  });

  it('given execute handler, when product updated, then publish product updated event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductUpdatedEvent(
        {...command.product, id: "anyProductId"},
        command.companyId,
        command.updatedBy
      )
    )
  });

});
