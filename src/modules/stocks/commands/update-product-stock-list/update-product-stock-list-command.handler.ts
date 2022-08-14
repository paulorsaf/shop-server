import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UpdateProductStockListCommand } from "./update-product-stock-list.command";

@CommandHandler(UpdateProductStockListCommand)
export class UpdateProductStockListCommandHandler implements ICommandHandler<UpdateProductStockListCommand> {

    constructor(
        private eventBus: EventBus
    ){}

    async execute(command: UpdateProductStockListCommand) {
        
    }

}