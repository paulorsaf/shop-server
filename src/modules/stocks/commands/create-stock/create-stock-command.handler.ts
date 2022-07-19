import { UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { randomUUID } from "crypto";
import { Stock, StockOption } from "../../entities/stock";
import { StockRepository } from "../../repositories/stock.repository";
import { CreateStockOptionCommand } from "./create-stock.command";
import { StockCreatedEvent } from "./events/stock-created.event";

@CommandHandler(CreateStockOptionCommand)
export class CreateStockOptionCommandHandler implements ICommandHandler<CreateStockOptionCommand> {

    constructor(
        private eventBus: EventBus,
        private stockRepository: StockRepository
    ){}

    async execute(command: CreateStockOptionCommand): Promise<void> {
        const savedStock = await this.stockRepository.findByProduct(command.productId);
        if (savedStock) {
            throw new UnauthorizedException('Nao autorizado');
        }

        const stock = this.createStock(command);

        this.stockRepository.createStock(stock);

        this.eventBus.publish(
            new StockCreatedEvent(
                command.companyId, command.productId, {
                    id: stock.id, stockOption: stock.stockOptions[0]
                }, command.createdBy
            )
        )
    }

    private createStock(command: CreateStockOptionCommand){
        const stockOption = this.createStockOption(command);
        return new Stock(command.companyId, command.productId, randomUUID(), [stockOption]);
    }

    private createStockOption(command: CreateStockOptionCommand) {
        return new StockOption(
            randomUUID(),
            command.stockOption.quantity,
            command.stockOption.color,
            command.stockOption.size
        )
    }

}