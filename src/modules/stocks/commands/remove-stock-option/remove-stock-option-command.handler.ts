import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StockRepository } from "../../repositories/stock.repository";
import { StockOptionRemovedEvent } from "./events/stock-option-removed.event";
import { RemoveStockOptionCommand } from "./remove-stock-option.command";

@CommandHandler(RemoveStockOptionCommand)
export class RemoveStockOptionCommandHandler implements ICommandHandler<RemoveStockOptionCommand> {

    constructor(
        private eventBus: EventBus,
        private stockRepository: StockRepository
    ){}

    async execute(command: RemoveStockOptionCommand) {
        await this.verifyStockBelongsToCompany(command);

        await this.stockRepository.removeStock(command.stockId)

        this.publishStockOptionRemovedEvent(command);
    }

    private async verifyStockBelongsToCompany(command: RemoveStockOptionCommand) {
        const stock = await this.stockRepository.findByProduct(command.productId);
        if (!stock) {
            throw new NotFoundException();
        }
        if (stock.companyId !== command.companyId) {
            throw new NotFoundException();
        }
        return stock;
    }

    private publishStockOptionRemovedEvent(command: RemoveStockOptionCommand) {
        this.eventBus.publish(
            new StockOptionRemovedEvent(
                command.companyId, command.productId, command.stockId, command.removedBy
            )
        )
    }

}