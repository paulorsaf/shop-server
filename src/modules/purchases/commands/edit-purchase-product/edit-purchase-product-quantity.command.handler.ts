import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PurchaseProductQuantityEditedEvent } from "../../events/purchase-product-quantity-edited.event";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { EditPurchaseProductQuantityCommand } from "./edit-purchase-product-quantity.command";

@CommandHandler(EditPurchaseProductQuantityCommand)
export class EditPurchaseProductQuantityCommandHandler implements ICommandHandler<EditPurchaseProductQuantityCommand> {

    constructor(
        public eventBus: EventBus,
        public purchaseRepository: PurchaseRepository
    ){}

    async execute(command: EditPurchaseProductQuantityCommand) {
        const purchase = await this.findProduct(command);
        const purchaseProduct = await this.findPurchaseProduct(command, purchase);

        let amount = command.value;
        if (purchaseProduct.unit === "KG") {
            amount = parseFloat((amount / purchaseProduct.weight).toPrecision(2));
        }

        await this.purchaseRepository.updateProductAmount({
            amount,
            purchase,
            purchaseProduct
        });

        const updatedPurchase = await this.findProduct(command);
        await this.purchaseRepository.updatePurchasePrice(updatedPurchase);

        this.publishPurchaseProductQuantityEditedEvent(command, amount);
        // should update purchase product in summary
    }

    private async findProduct(command: EditPurchaseProductQuantityCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, id: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException("Compra não encontrada");
        }
        return purchase;
    }

    private async findPurchaseProduct(
        command: EditPurchaseProductQuantityCommand, purchase: Purchase
    ) {
        const purchaseProduct = purchase.products.find(p =>
            p.id === command.productId && p.stock.id === command.stockId
        );
        if (!purchaseProduct) {
            throw new NotFoundException("Produto não encontrado");
        }
        return purchaseProduct;
    }

    private publishPurchaseProductQuantityEditedEvent(
        command: EditPurchaseProductQuantityCommand, amount: number
    ) {
        this.eventBus.publish(
            new PurchaseProductQuantityEditedEvent(
                command.companyId,
                command.purchaseId,
                command.productId,
                command.stockId,
                amount,
                command.userId
            )
        )
    }

}