import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CreateProductCommand } from './create-product.command';
import { CreateProductCommandHandler } from './create-product-command.handler';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductRepository } from '../../../products/repositories/product.repository';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { ProductCreatedEvent } from './events/product-created.event';

describe('CreateProductCommandHandler', () => {

  let handler: CreateProductCommandHandler;
  let productRepository: RepositoryMock;
  let eventBus: EventBusMock;

  const productDto = new CreateProductDTO(
    'anyName', 'anyCategoryId', 10, 8, 1
  )
  const command = new CreateProductCommand(
    productDto, 'anyCompanyId', 'anyUserId'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();
    productRepository = new RepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CreateProductCommandHandler
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

    handler = module.get<CreateProductCommandHandler>(CreateProductCommandHandler);

    productRepository.response = {id: "anyProductId"};
  });

  it('given execute handler, then save product', async () => {
    await handler.execute(command);

    expect(productRepository.savedWith).toEqual({
      ...command.product,
      companyId: command.companyId,
      createdBy: command.createdBy
    })
  });

  it('given execute handler, when product saved, then publish product created event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductCreatedEvent(
        {...command.product, id: "anyProductId"},
        command.companyId,
        command.createdBy
      )
    )
  });

});
