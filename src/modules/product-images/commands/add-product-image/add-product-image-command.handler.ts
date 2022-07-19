import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { ProductImageRepository } from "../../repositories/product-image.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { StorageRepository } from "../../repositories/storage.repository";
import { AddProductImageCommand } from "./add-product-image.command";

@CommandHandler(AddProductImageCommand)
export class AddProductImageCommandHandler implements ICommandHandler<AddProductImageCommand> {

    constructor(
        private productImageRepository: ProductImageRepository,
        private productRepository: ProductRepository,
        private storageRepository: StorageRepository
    ) {}

    async execute(command: AddProductImageCommand) {
        const product = await this.findProduct(command);

        const fileName = this.getRandomFileName(command.image.filename);
        const imageUrl = await this.saveFileOnStorage(command, fileName);

        this.productImageRepository.addImage({
            imageUrl, productId: command.productId, fileName
        })

        return null;
    }

    private async saveFileOnStorage(command: AddProductImageCommand, fileName: string) {
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

    private async findProduct(command: AddProductImageCommand) {
        const product = await this.productRepository.findById(command.productId);
        if (!product) {
            throw new NotFoundException('Produto nao encontrado');
        }
        if (product.companyId !== command.companyId) {
            throw new UnauthorizedException('Açao nao autorizada');
        }
        return product;
    }

}