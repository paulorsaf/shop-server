import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Product } from "../../entities/product";
import { ProductRepository } from "../../repositories/product.repository";
import { CreateProductCommand } from "./create-product.command";
import { ProductCreatedEvent } from "./events/product-created.event";

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand> {

    constructor(
        private productRepository: ProductRepository,
        private eventBus: EventBus
    ){ }

    async execute(command: CreateProductCommand) {
        const savedProduct = await this.productRepository.save({
            ...command.product,
            companyId: command.companyId,
            createdBy: command.createdBy
        });

        this.publishProductCreatedEvent(command, savedProduct.id);
    }

    private publishProductCreatedEvent(command: CreateProductCommand, productId: string) {
        this.eventBus.publish(
            new ProductCreatedEvent(
                {...command.product, id: productId},
                command.companyId,
                command.createdBy
            )
        )
    }

}