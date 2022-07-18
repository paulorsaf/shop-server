import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { StockOption } from "../../entities/stock";
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
        const stock = await this.stockRepository.findByProduct(command.productId);
        if (!stock) {
            throw new NotFoundException();
        }
        if (stock.companyId !== command.companyId) {
            throw new UnauthorizedException()
        }

        const stockOption = this.createStockOption(command);
        this.stockRepository.addStockOption(stock.id, stockOption);

        this.eventBus.publish(
            new StockOptionAddedEvent(
                command.companyId, command.productId, stock.id, stockOption, command.createdBy
            )
        )
    }

    private createStockOption(command: AddStockOptionCommand) {
        return new StockOption(
            randomUUID(),
            command.stockOption.quantity,
            command.stockOption.color,
            command.stockOption.size
        )
    }

}