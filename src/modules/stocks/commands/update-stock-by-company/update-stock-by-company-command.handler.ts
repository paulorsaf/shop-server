import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyTotalStockUpdatedEvent } from "../../events/company-total-stock-updated.event";
import { CompanyStockFactory } from "./factories/company-stock.factory";
import { ProductStockRepository } from "./repositories/product-stock.repository";
import { UpdateStockByCompanyCommand } from "./update-stock-by-company.command";

@CommandHandler(UpdateStockByCompanyCommand)
export class UpdateStockByCompanyCommandHandler implements ICommandHandler<UpdateStockByCompanyCommand> {

    constructor(
        private companyStockFactory: CompanyStockFactory,
        private eventBus: EventBus,
        private productStockRepository: ProductStockRepository
    ){}

    async execute(command: UpdateStockByCompanyCommand) {
        const companyStock = this.companyStockFactory.createStock(command.companyId);
        if (!companyStock) {
            throw new NotFoundException('Estoque não encontrado');
        }

        const products = await companyStock.findAll();

        await Promise.allSettled(products.map(product =>
            this.productStockRepository.updateStockAmount({
                ...product,
                companyId: command.companyId,
                productInternalId: product.productInternalId,
            }))
        );

        this.publishCompanyTotalStockUpdatedEvent(command)
    }

    private publishCompanyTotalStockUpdatedEvent(command: UpdateStockByCompanyCommand) {
        this.eventBus.publish(
            new CompanyTotalStockUpdatedEvent(
                command.companyId,
                command.updatedBy
            )
        )
    }

}