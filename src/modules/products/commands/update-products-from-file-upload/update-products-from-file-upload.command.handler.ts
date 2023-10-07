import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProductsFromFileUploadCommand } from "./update-products-from-file-upload.command";
import { WrongFileTypeException } from "../../exceptions/wrong-file-type.exception";
import { ProductRepository } from "../../repositories/product.repository";
import { ProductsFromFileUploadUpdatedEvent } from "./events/products-from-file-upload-updated.event";
import { FileRepository } from "../../repositories/file.repository";
import { CellIsNotANumberException } from "../../exceptions/cell-is-not-a-number.exception";
import { ProductsFromFile } from "../../types/products-from-file.type";

@CommandHandler(UpdateProductsFromFileUploadCommand)
export class UpdateProductsFromFileUploadCommandHandler
    implements ICommandHandler<UpdateProductsFromFileUploadCommand> {

    constructor(
        private eventBus: EventBus,
        private fileRepository: FileRepository,
        private productRepository: ProductRepository
    ){}

    async execute(command: UpdateProductsFromFileUploadCommand) {
        if (!command.filePath.endsWith('.xlsx')) {
            throw new WrongFileTypeException('.xlsx');
        }

        const workbook = await this.fileRepository.loadProductsFromFile(command.filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const products: ProductsFromFile[] = [];
        for (let i=2; ; i++) {
            const productInternalId = sheet?.[`A${i}`]?.["w"];
            if (!productInternalId) {
                break;
            }

            const price = parseFloat(sheet?.[`B${i}`]?.["w"]?.replace(',', '.'));
            if (isNaN(price)) {
                throw new CellIsNotANumberException(`B${i}`);
            }
            const priceWithDiscount = parseFloat(sheet?.[`C${i}`]?.["w"]?.replace(',', '.'));
            if (isNaN(priceWithDiscount)) {
                throw new CellIsNotANumberException(`C${i}`);
            }
            const stock = parseFloat(sheet?.[`D${i}`]?.["w"]?.replace(',', '.'));
            if (isNaN(stock)) {
                throw new CellIsNotANumberException(`D${i}`);
            }

            products.push({ price, priceWithDiscount, productInternalId, stock });
        }
        
        await this.productRepository.updateFromUpload({
            companyId: command.companyId,
            products,
            userId: command.userId
        });

        this.eventBus.publish(
            new ProductsFromFileUploadUpdatedEvent(
                command.companyId,
                command.userId,
                products
            )
        )
    }

}