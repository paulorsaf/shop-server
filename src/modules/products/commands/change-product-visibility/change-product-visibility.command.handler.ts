import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ProductNotFoundException } from "../../exceptions/product-not-found.exception";
import { ProductRepository } from "../../repositories/product.repository";
import { ChangeProductVisibilityCommand } from "./change-product-visibility.command";
import { ProductVisibilityChangedEvent } from "./events/change-product-visibility.event";

@CommandHandler(ChangeProductVisibilityCommand)
export class ChangeProductVisibilityCommandHandler implements ICommandHandler<ChangeProductVisibilityCommand> {

    constructor(
        private eventBus: EventBus,
        private productRepository: ProductRepository
    ){}

    async execute(command: ChangeProductVisibilityCommand) {
        const product = await this.findProduct(command);

        const isVisible = !product.isVisible;

        await this.productRepository.setVisibility({
            isVisible,
            productId: product.id
        });

        this.publishProductVisibilityChangedEvent(command, isVisible);
    }

    private async findProduct(command: ChangeProductVisibilityCommand) {
        const product = await this.productRepository.findByCompanyIdAndId(
            command.companyId,
            command.productId
        );
        if (!product) {
            throw new ProductNotFoundException();
        }
        return product;
    }

    private publishProductVisibilityChangedEvent(
        command: ChangeProductVisibilityCommand, isVisible: boolean
    ) {
        this.eventBus.publish(
            new ProductVisibilityChangedEvent(
                command.companyId,
                command.userId,
                isVisible
            )
        );
    }

}