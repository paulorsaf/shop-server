import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PurchaseProductCancelledEvent } from "../../events/purchase-product-cancelled.event";
import { PurchaseProductQuantityEditedEvent } from "../../events/purchase-product-quantity-edited.event";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { CancelPurchaseProductCommand } from "./cancel-purchase-product.command";

@CommandHandler(CancelPurchaseProductCommand)
export class CancelPurchaseProductCommandHandler implements ICommandHandler<CancelPurchaseProductCommand> {

    constructor(
        public eventBus: EventBus,
        public purchaseRepository: PurchaseRepository
    ){}

    async execute(command: CancelPurchaseProductCommand) {
        const purchase = await this.findProduct(command);
        const purchaseProduct = await this.findPurchaseProduct(command, purchase);

        await this.purchaseRepository.cancelPurchaseProduct({
            purchase,
            purchaseProduct
        });

        const updatedPurchase = await this.findProduct(command);
        await this.purchaseRepository.updatePurchasePrice(updatedPurchase);

        this.publishPurchaseProductCancelledEvent(command);
        // should update purchase product in summary
    }

    private async findProduct(command: CancelPurchaseProductCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, id: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException("Compra não encontrada");
        }
        return purchase;
    }

    private async findPurchaseProduct(
        command: CancelPurchaseProductCommand, purchase: Purchase
    ) {
        const purchaseProduct = purchase.products.find(p =>
            p.id === command.productId && p.stock.id === command.stockId
        );
        if (!purchaseProduct) {
            throw new NotFoundException("Produto não encontrado");
        }
        return purchaseProduct;
    }

    private publishPurchaseProductCancelledEvent(
        command: CancelPurchaseProductCommand
    ) {
        this.eventBus.publish(
            new PurchaseProductCancelledEvent(
                command.companyId,
                command.purchaseId,
                command.productId,
                command.stockId,
                command.userId
            )
        )
    }

}