import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PurchaseStatusUpdatedEvent } from "../../events/purchase-status-updated.event";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { UpdatePurchaseStatusCommand } from "./update-purchase-status.command";

@CommandHandler(UpdatePurchaseStatusCommand)
export class UpdatePurchaseStatusCommandHandler implements ICommandHandler<UpdatePurchaseStatusCommand> {

    constructor(
        public eventBus: EventBus,
        public purchaseRepository: PurchaseRepository
    ){}

    async execute(command: UpdatePurchaseStatusCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, id: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException("Compra nao encontrada");
        }

        purchase.updateStatus(command.status);

        await this.purchaseRepository.updateStatus(purchase);

        this.publishPurchaseStatusUpdatedEvent(command);
    }

    private publishPurchaseStatusUpdatedEvent(command: UpdatePurchaseStatusCommand) {
        this.eventBus.publish(
            new PurchaseStatusUpdatedEvent(
                command.companyId,
                command.purchaseId,
                command.status,
                command.userId
            )
        )
    }

}