import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ProductRepository } from "../../repositories/product.repository";
import { StockRepository } from "../../repositories/stock.repository";
import { ProductStockUpdatedEvent } from "./events/product-stock-updated.event";
import { UpdateProductStockCommand } from "./update-product-stock.command";

@CommandHandler(UpdateProductStockCommand)
export class UpdateProductStockCommandHandler implements ICommandHandler<UpdateProductStockCommand> {

    constructor(
        private eventBus: EventBus,
        private productRepository: ProductRepository,
        private stockRepository: StockRepository
    ){}

    async execute(command: UpdateProductStockCommand) {
        const amount = await this.stockRepository.getTotalStockByProduct(command.productId);
        this.productRepository.updateStockAmount({amount, productId: command.productId});

        this.publishProductStockUpdatedEvent(command, amount);
    }

    private publishProductStockUpdatedEvent(command: UpdateProductStockCommand, amount: number) {
        this.eventBus.publish(
            new ProductStockUpdatedEvent(
                command.companyId, command.productId, amount, command.updatedBy
            )
        )
    }

}