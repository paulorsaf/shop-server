import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Stock } from "../../entities/stock";
import { StockWithSameConfigurationException } from "../../exceptions/stock-with-same-configuration.exception";
import { StockRepository } from "../../repositories/stock.repository";
import { AddStockOptionCommand } from "./add-stock-option.command";
import { StockOptionAddedEvent } from "./events/stock-option-added.event";

@CommandHandler(AddStockOptionCommand)
export class AddStockOptionCommandHandler implements ICommandHandler<AddStockOptionCommand> {

    constructor(
        private eventBus: EventBus,
        private stockRepository: StockRepository
    ){}

    async execute(command: AddStockOptionCommand) {
        const stocks = await this.findExistingStocks(command);
        if (this.hasStockWithSameConfiguration(stocks, command)) {
            throw new StockWithSameConfigurationException();
        }

        const stock = this.createStock(command);
        const id = await this.stockRepository.addStock(stock);

        this.publishStockOptionAddedEvent(command, stock, id);
    }

    private hasStockWithSameConfiguration(stocks: Stock[], command: AddStockOptionCommand) {
        if (!stocks) {
            return false;
        }
        return stocks.some(stock =>
            stock.color === command.stockOption.color &&
            stock.size === command.stockOption.size
        );
    }

    private async findExistingStocks(command: AddStockOptionCommand) {
        return await this.stockRepository.findByProductAndCompany(
            command.productId, command.companyId
        );
    }

    private createStock(command: AddStockOptionCommand) {
        return new Stock(
            command.companyId,
            command.productId,
            undefined,
            undefined,
            command.stockOption.quantity,
            command.stockOption.color,
            command.stockOption.size
        )
    }

    private publishStockOptionAddedEvent(
        command: AddStockOptionCommand, stock: Stock, stockId: string
    ) {
        this.eventBus.publish(
            new StockOptionAddedEvent(
                command.companyId, command.productId, {
                    id: stockId, quantity: stock.quantity, color: stock.color, size: stock.size
                }, command.createdBy
            )
        )
    }

}