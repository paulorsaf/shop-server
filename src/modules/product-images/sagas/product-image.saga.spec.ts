import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { DeleteProductFileCommand } from '../../storage/commands/delete-product-file/delete-product-file.command';
import { ProductImageDeletedEvent } from '../commands/delete-product-image/events/product-image-deleted.event';
import { ProductImageSagas } from './product-image.saga';

describe('ProductImageSagas', () => {

  let sagas: ProductImageSagas;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ProductImageSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<ProductImageSagas>(ProductImageSagas);
  });

  it('given product removed, then publish remove stock command', done => {
    const event = new ProductImageDeletedEvent(
      'anyCompanyId', 'anyProductId', {
        fileName: 'anyFileName', imageUrl: 'anyImageUrl'
      }, 'anyUserId'
    );

    sagas.productImageDeleted(of(event)).subscribe(response => {
      expect(response).toEqual(
        new DeleteProductFileCommand(
          event.companyId, event.productId, event.image.fileName, event.userId
        )
      );
      done();
    });
  });

});
