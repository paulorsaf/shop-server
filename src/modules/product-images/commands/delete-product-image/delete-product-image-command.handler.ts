import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Product, ProductImage } from "../../entities/product";
import { ProductImageRepository } from "../../repositories/product-image.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { DeleteProductImageCommand } from "./delete-product-image.command";
import { ProductImageDeletedEvent } from "./events/product-image-deleted.event";

@CommandHandler(DeleteProductImageCommand)
export class DeleteProductImageCommandHandler implements ICommandHandler<DeleteProductImageCommand> {

    constructor(
        private eventBus: EventBus,
        private productImageRepository: ProductImageRepository,
        private productRepository: ProductRepository
    ){}

    async execute(command: DeleteProductImageCommand) {
        const image = await this.findProductImage(command);

        await this.productImageRepository.removeImage({
            fileName: image.fileName,
            imageUrl: image.imageUrl,
            productId: command.productId
        })

        this.publishProductImageDeletedEvent(command, image);
    }

    private async findProductImage(command: DeleteProductImageCommand){
        const product = await this.findProduct(command);

        const image = product.images?.find(i => i.fileName === command.fileName);
        if (!image) {
            throw new NotFoundException();
        }
        return image;
    }

    private async findProduct(command: DeleteProductImageCommand){
        const product = await this.productRepository.findById(command.productId);
        if (!product) {
            throw new NotFoundException();
        }
        if (product.companyId !== command.companyId) {
            throw new NotFoundException();
        }
        return product;
    }

    private publishProductImageDeletedEvent(command: DeleteProductImageCommand, image: ProductImage){
        this.eventBus.publish(
            new ProductImageDeletedEvent(
                command.companyId, command.productId, {
                    fileName: image.fileName, imageUrl: image.imageUrl
                }, command.deletedBy
            )
        )
    }

}