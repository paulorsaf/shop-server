import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { UpdateProductsFromFileUploadCommand } from './update-products-from-file-upload.command';
import { UpdateProductsFromFileUploadCommandHandler } from './update-products-from-file-upload.command.handler';
import { ProductRepository } from '../../repositories/product.repository';
import { RepositoryMock } from '../../../../mocks/repository.mock';
import { WrongFileTypeException } from '../../exceptions/wrong-file-type.exception';
import { ProductsFromFileUploadUpdatedEvent } from './events/products-from-file-upload-updated.event';
import { productsFromFileMock } from './mock/products-from-file.mock';
import { FileRepository } from '../../repositories/file.repository';
import { CellIsNotANumberException } from '../../exceptions/cell-is-not-a-number.exception';

describe('UpdateProductsFromFileUploadCommandHandler', () => {

    let handler: UpdateProductsFromFileUploadCommandHandler;
    let productRepository: ProductRepositoryMock;
    let fileRepository: FileRepositoryMock;
    let eventBus: EventBusMock;

    const userId = "anyUserId";
    const companyId = "anyCompanyId";
    const filePath = "anyFilePath.xlsx";

    const command = new UpdateProductsFromFileUploadCommand(
        userId, companyId, filePath
    );

    beforeEach(async () => {
        eventBus = new EventBusMock();
        fileRepository = new FileRepositoryMock();
        productRepository = new ProductRepositoryMock();

        const module: TestingModule = await Test.createTestingModule({
            controllers: [
                UpdateProductsFromFileUploadCommandHandler
            ],
            imports: [
                CqrsModule
            ],
            providers: [
                FileRepository,
                ProductRepository
            ]
        })
        .overrideProvider(EventBus).useValue(eventBus)
        .overrideProvider(FileRepository).useValue(fileRepository)
        .overrideProvider(ProductRepository).useValue(productRepository)
        .compile();

        handler = module.get<UpdateProductsFromFileUploadCommandHandler>(UpdateProductsFromFileUploadCommandHandler);
    });

    it('given file is not .xlsx, then throw file is not of type exception', async () => {
        const command = new UpdateProductsFromFileUploadCommand(
            userId, companyId, "anyFilePath.doc"
        );

        await expect(handler.execute(command))
            .rejects.toThrowError(WrongFileTypeException);
    });

    describe('given file is .xlsx', () => {

        let workbook;

        beforeEach(() => {
            workbook = JSON.parse(JSON.stringify(productsFromFileMock));
            fileRepository._loadProductsFromFileResponse = workbook
        })

        it('when any price is not a number, then throw cell is not a number exception', async () => {
            workbook.Sheets.Sheet1.B5.w = "not a number";

            await expect(handler.execute(command))
                .rejects.toThrowError(CellIsNotANumberException);
        })

        it('when any price with discount is not a number, then throw cell is not a number exception', async () => {
            workbook.Sheets.Sheet1.C5.w = "not a number";

            await expect(handler.execute(command))
                .rejects.toThrowError(CellIsNotANumberException);
        })

        it('when any stock is not a number, then throw cell is not a number exception', async () => {
            workbook.Sheets.Sheet1.D5.w = "not a number";

            await expect(handler.execute(command))
                .rejects.toThrowError(CellIsNotANumberException);
        })

        it('then update products from upload', async () => {
            await handler.execute(command);

            expect(productRepository._hasUpdatedFromUploadWith).toEqual({
                companyId,
                products: [
                    { productInternalId: "420",  price:  1.65, priceWithDiscount: 0, stock: 100 },
                    { productInternalId: "500",  price:  3.19, priceWithDiscount: 0, stock: 100 },
                    { productInternalId: "520",  price:  3.19, priceWithDiscount: 0, stock: 100 },
                    { productInternalId: "700",  price:  4.40, priceWithDiscount: 0, stock: 100 },
                    { productInternalId: "840",  price:  4.40, priceWithDiscount: 0, stock: 100 }
                ],
                userId
            });
        })

        it('then publish products upload updated event', async () => {
            await handler.execute(command);

            expect(eventBus.published).toBeInstanceOf(ProductsFromFileUploadUpdatedEvent);
        })

    })

});

class FileRepositoryMock {
    _loadProductsFromFileResponse;
    loadProductsFromFile() {
        return this._loadProductsFromFileResponse;
    }
}

class ProductRepositoryMock {
    _hasUpdatedFromUploadWith;
    updateFromUpload(params) {
        this._hasUpdatedFromUploadWith = params;
    }
}