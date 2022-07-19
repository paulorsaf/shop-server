import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ProductRepository } from "../../repositories/product.repository";
import { UpdateProductStockCommand } from "./update-product-stock.command";

@CommandHandler(UpdateProductStockCommand)
export class UpdateProductStockCommandHandler implements ICommandHandler<UpdateProductStockCommand> {

    constructor(
        private productRepository: ProductRepository
    ){}

    async execute(command: UpdateProductStockCommand) {
        const product = await this.findProductByIdAndCompanyId(command);

        this.productRepository.updateStockAmount({
            amount: product.stock + command.amount,
            productId: command.productId
        })
    }

    private async findProductByIdAndCompanyId(command: UpdateProductStockCommand) {
        const product = await this.productRepository.findById(command.productId);
        if (!product) {
            throw new NotFoundException('Produto nao encontrado');
        }
        if (product.companyId !== command.companyId) {
            throw new NotFoundException('Produto nao encontrado');
        }
        return product;
    }

}