import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StockOption } from "../../entities/stock";
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
        const stockOption = await this.findStockOption(command);

        await this.stockRepository.removeStockOption({
            stockId: command.stockId, stockOption
        })

        this.publishStockOptionRemovedEvent(command, stockOption);
    }

    private async findStockOption(command: RemoveStockOptionCommand) {
        const stock = await this.findStock(command);

        const stockOption = stock.stockOptions.find(s => s.id === command.stockOptionId);
        if (!stockOption) {
            throw new NotFoundException();
        }

        return stockOption;
    }

    private async findStock(command: RemoveStockOptionCommand) {
        const stock = await this.stockRepository.findByProduct(command.productId);
        if (!stock) {
            throw new NotFoundException();
        }
        if (stock.companyId !== command.companyId) {
            throw new NotFoundException();
        }
        return stock;
    }

    private publishStockOptionRemovedEvent(
        command: RemoveStockOptionCommand, stockOption: StockOption
    ) {
        this.eventBus.publish(
            new StockOptionRemovedEvent(
                command.companyId, command.productId, {
                    stockId: command.stockId, stockOption: stockOption
                },
                command.removedBy
            )
        )
    }

}