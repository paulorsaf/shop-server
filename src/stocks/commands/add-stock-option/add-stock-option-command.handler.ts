import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { Stock, StockOption } from "../../entities/stock";
import { StockRepository } from "../../repositories/stock.repository";
import { AddStockOptionCommand } from "./add-stock-option.command";

@CommandHandler(AddStockOptionCommand)
export class AddStockOptionCommandHandler implements ICommandHandler<AddStockOptionCommand> {

    constructor(
        private stockRepository: StockRepository
    ){}

    async execute(command: AddStockOptionCommand): Promise<void> {
        const savedStock = await this.stockRepository.findByProduct(command.productId);
        if (savedStock) {
            throw new UnauthorizedException('Nao autorizado');
        }

        const stock = this.createStock(command);

        this.stockRepository.createStock(stock);
    }

    private createStock(command: AddStockOptionCommand){
        const stockOption = this.createStockOption(command);
        return new Stock(command.companyId, command.productId, randomUUID(), [stockOption]);
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