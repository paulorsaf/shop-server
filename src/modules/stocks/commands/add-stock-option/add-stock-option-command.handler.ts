import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { StockOption } from "../../entities/stock";
import { StockRepository } from "../../repositories/stock.repository";
import { AddStockOptionCommand } from "./add-stock-option.command";

@CommandHandler(AddStockOptionCommand)
export class AddStockOptionCommandHandler implements ICommandHandler<AddStockOptionCommand> {

    constructor(
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