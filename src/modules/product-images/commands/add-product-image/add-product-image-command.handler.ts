import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { ProductImageRepository } from "../../repositories/product-image.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { StorageRepository } from "../../repositories/storage.repository";
import { AddProductImageCommand } from "./add-product-image.command";
import { ProductImageAddedEvent } from "./events/product-image-added.event";

@CommandHandler(AddProductImageCommand)
export class AddProductImageCommandHandler implements ICommandHandler<AddProductImageCommand> {

    constructor(
        private eventBus: EventBus,
        private productImageRepository: ProductImageRepository,
        private productRepository: ProductRepository,
        private storageRepository: StorageRepository
    ) {}

    async execute(command: AddProductImageCommand) {
        await this.verifyProductExistsAndBelongsToCompany(command);

        const savedImage = await this.saveFileOnStorage(command);

        const image = {
            imageUrl: savedImage.imageUrl,
            productId: command.productId,
            fileName: savedImage.fileName
        };
        this.productImageRepository.addImage(image);

        this.publishProductImageAddedEvent(command, image);
    }

    private async saveFileOnStorage(command: AddProductImageCommand) {
        const fileName = this.getRandomFileName(command.image.filename);
        
        return await this.storageRepository.save({
            companyId: command.companyId,
            filePath: command.image.path,
            productId: command.productId,
            name: fileName
        });
    }

    private getRandomFileName(filename: string) {
        return randomUUID() + filename.substring(filename.lastIndexOf('.'))
    }

    private async verifyProductExistsAndBelongsToCompany(command: AddProductImageCommand) {
        const product = await this.productRepository.findById(command.productId);
        if (!product) {
            throw new NotFoundException('Produto nao encontrado');
        }
        if (product.companyId !== command.companyId) {
            throw new UnauthorizedException('Açao nao autorizada');
        }
    }

    private publishProductImageAddedEvent(
        command: AddProductImageCommand, image: {imageUrl: string, fileName: string}
    ) {
        this.eventBus.publish(
            new ProductImageAddedEvent(
                command.companyId, command.productId, {
                    imageUrl: image.imageUrl, fileName: image.fileName
                }, command.createdBy
            )
        );
    }

}