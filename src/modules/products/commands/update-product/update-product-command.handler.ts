import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ProductRepository } from "../../repositories/product.repository";
import { ProductUpdatedEvent } from "./events/product-updated.event";
import { UpdateProductCommand } from "./update-product.command";

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<UpdateProductCommand> {

    constructor(
        private productRepository: ProductRepository,
        private eventBus: EventBus
    ){}

    async execute(command: UpdateProductCommand): Promise<void> {
        await this.verifyProductByIdAndCompanyId(command.product.id, command.companyId);
        
        await this.productRepository.update({
            companyId: command.companyId,
            updatedBy: command.updatedBy,
            ...command.product
        })

        this.publishProductUpdatedEvent(command);
    }

    private async verifyProductByIdAndCompanyId(id: string, companyId: string) {
        const product = await this.productRepository.findById(id);
        if (!product) {
            throw new NotFoundException('Produto nao encontrado');
        }
        if (product.companyId !== companyId) {
            throw new UnauthorizedException('Operaçao nao autorizada');
        }
        return product;
    }

    private publishProductUpdatedEvent(command: UpdateProductCommand) {
        this.eventBus.publish(
            new ProductUpdatedEvent(
                command.product,
                command.companyId,
                command.updatedBy
            )
        )
    }

}