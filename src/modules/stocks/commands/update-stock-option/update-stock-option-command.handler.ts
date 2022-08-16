import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Stock } from "../../entities/stock";
import { StockWithSameConfigurationException } from "../../exceptions/stock-with-same-configuration.exception";
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
        await this.verifyStockExistsAndIsValid(command);

        const update = this.createStockUpdate(command);
        await this.stockRepository.updateStockOption({
            stockId: command.stockId, stock: update
        });

        this.publishStockOptionUpdatedEvent(command, update);
    }

    private async verifyStockExistsAndIsValid(command: UpdateStockOptionCommand) {
        const stock = await this.stockRepository.findById(command.stockId);
        if (!stock) {
            throw new NotFoundException();
        }

        const stocks = await this.findExistingStocks(command);
        if (this.hasStockWithSameConfiguration(stocks, stock)) {
            throw new StockWithSameConfigurationException();
        }
    }

    private hasStockWithSameConfiguration(stocks: Stock[], stock: Stock) {
        return stocks
            .filter(s => s.id !== stock.id)
            .find(s => s.color === stock.color && s.size === stock.size);
    }

    private createStockUpdate(command: UpdateStockOptionCommand) {
        return {
            color: command.stockOption.color,
            quantity: command.stockOption.quantity,
            size: command.stockOption.size
        }
    }

    private publishStockOptionUpdatedEvent(
        command: UpdateStockOptionCommand, stock: StockUpdate
    ) {
        this.eventBus.publish(
            new StockOptionUpdatedEvent(
                command.companyId, command.productId, command.stockId,
                stock, command.updatedBy
            )
        );
    }

    private async findExistingStocks(command: UpdateStockOptionCommand) {
        return await this.stockRepository.findByProductAndCompany(
            command.productId, command.companyId
        );
    }

}

type StockUpdate = {
    color: string;
    quantity: number;
    size: string;
}