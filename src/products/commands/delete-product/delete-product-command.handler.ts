import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Product } from "src/products/entities/product";
import { ProductRepository } from "../../repositories/product.repository";
import { DeleteProductCommand } from "./delete-product.command";
import { ProductDeletedEvent } from "./events/product-deleted.event";

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler implements ICommandHandler<DeleteProductCommand> {

    constructor(
        private eventBus: EventBus,
        private productRepository: ProductRepository
    ) {}

    async execute(command: DeleteProductCommand) {
        const product = await this.findProduct(command);

        this.productRepository.delete(product.id);

        this.eventBus.publish(
            new ProductDeletedEvent(
                {id: product.id},
                command.companyId,
                command.userId
            )
        );
    }

    private async findProduct(command: DeleteProductCommand): Promise<Product> {
        const product = await this.productRepository.findById(command.id);
        if (!product) {
            throw new NotFoundException();
        }
        if (product.companyId !== command.companyId) {
            throw new UnauthorizedException();
        }
        return product;
    }

}