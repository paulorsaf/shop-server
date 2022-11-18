import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PurchaseSentToSystemEvent } from "../../events/purchase-sent-to-system.event";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { CompanySystemFactory } from "./factories/company-system.factory";
import { SendPurchaseToSystemCommand } from "./send-purchase-to-system.command";

@CommandHandler(SendPurchaseToSystemCommand)
export class SendPurchaseToSystemCommandHandler implements ICommandHandler<SendPurchaseToSystemCommand> {

    constructor(
        private companySystemFactory: CompanySystemFactory,
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SendPurchaseToSystemCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, id: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException('Compra não encontrada');
        }

        const system = this.companySystemFactory.createSystem(command.companyId);
        await system.send(purchase);

        this.publishPurchaseSentToSystemEvent(command);
    }

    private publishPurchaseSentToSystemEvent(command: SendPurchaseToSystemCommand) {
        this.eventBus.publish(
            new PurchaseSentToSystemEvent(
                command.companyId,
                command.purchaseId,
                command.userId
            )
        )
    }

}