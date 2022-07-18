import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
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
        const product = {
            ...command.product,
            companyId: command.companyId,
            createdBy: command.createdBy
        };

        const savedProduct = await this.productRepository.save(product);

        this.eventBus.publish(
            new ProductCreatedEvent(
                {...command.product, id: savedProduct.id},
                command.companyId,
                command.createdBy
            )
        )
    }

}