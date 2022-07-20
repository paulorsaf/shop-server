import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StockRepository } from "../../repositories/stock.repository";
import { StockRemovedEvent } from "./events/stock-removed.event";
import { RemoveStockByProductCommand } from "./remove-stock-by-product.command";

@CommandHandler(RemoveStockByProductCommand)
export class RemoveStockByProductCommandHandler implements ICommandHandler<RemoveStockByProductCommand> {

    constructor(
        private eventBus: EventBus,
        private stockRepository: StockRepository
    ){}

    async execute(command: RemoveStockByProductCommand) {
        const stock = await this.findStock(command);

        await this.stockRepository.removeStock(stock.id);

        this.eventBus.publish(
            new StockRemovedEvent(
                command.companyId, command.productId, stock.id, command.removedBy
            )
        )
    }

    private async findStock(command: RemoveStockByProductCommand) {
        const stock = await this.stockRepository.findByProduct(command.productId);
        if (!stock) {
            throw new NotFoundException();
        }
        if (stock.companyId !== command.companyId) {
            throw new NotFoundException();
        }
        return stock;
    }

}