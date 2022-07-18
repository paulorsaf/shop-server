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
        if (savedStock && savedStock.companyId !== command.companyId) {
            throw new UnauthorizedException('Nao autorizado');
        }

        const stockOption = this.createStockOption(command);
        const stock = this.createStock(
            command.companyId, command.productId, savedStock?.stockOptions || [], stockOption
        );
        this.stockRepository.addStock(stock);
    }

    private createStockOption(command: AddStockOptionCommand) {
        return new StockOption(
            randomUUID(),
            command.stockOption.quantity,
            command.stockOption.color,
            command.stockOption.size
        )
    }

    private createStock(
        companyId: string, productId: string, stockOptions: StockOption[], stockOption: StockOption
    ){
        return new Stock(companyId, productId, [...stockOptions, stockOption]);
    }

}