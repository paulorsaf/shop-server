import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Stock, StockOption } from "../../entities/stock";
import { StockRepository } from "../../repositories/stock.repository";
import { StockOptionUpdatedEvent } from "./events/stock-option-updated.event";
import { UpdateStockOptionCommand } from "./update-stock-option.command";

@CommandHandler(UpdateStockOptionCommand)
export class UpdateStockOptionCommandHandler implements ICommandHandler<UpdateStockOptionCommand> {

    constructor(
        private eventBus: EventBus,
        private stockRepository: StockRepository
    ){}

    async execute(command: UpdateStockOptionCommand) {
        const stockOption = await this.findStockOption(command);
        
        const newStockOption = new StockOption(
            command.stockOptionId, command.stockOption.quantity, command.stockOption.color,
            command.stockOption.size
        );
        await this.stockRepository.updateStockOption({
            stockId: command.stockId,
            originalStockOption: stockOption,
            stockOption: newStockOption
        });

        this.publishStockOptionUpdatedEvent(command, stockOption, newStockOption);
    }

    private publishStockOptionUpdatedEvent(
        command: UpdateStockOptionCommand, originalStockOption: StockOption, newStockOption: StockOption
    ) {
        this.eventBus.publish(
            new StockOptionUpdatedEvent(
                command.companyId, command.productId, command.stockId, originalStockOption,
                newStockOption, command.updatedBy
            )
        );
    }

    private async findStockOption(command: UpdateStockOptionCommand) {
        const stock = await this.findStock(command);
        const stockOption = stock.stockOptions.find(s => s.id === command.stockOptionId);
        if (!stockOption) {
            throw new NotFoundException();
        }
        return stockOption;
    }

    private async findStock(command: UpdateStockOptionCommand) {
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