import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PurchaseSentToSystemEvent } from "../../events/purchase-sent-to-system.event";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { CompanySystemFactory } from "./factories/company-system.factory";
import { UserRepository } from "./repositories/user.repository";
import { SendPurchaseToSystemCommand } from "./send-purchase-to-system.command";

@CommandHandler(SendPurchaseToSystemCommand)
export class SendPurchaseToSystemCommandHandler implements ICommandHandler<SendPurchaseToSystemCommand> {

    constructor(
        private companySystemFactory: CompanySystemFactory,
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository,
        private userRepository: UserRepository
    ){}

    async execute(command: SendPurchaseToSystemCommand) {
        const purchase = await this.findPurchase(command);
        const user = await this.findUser(purchase);

        const system = this.companySystemFactory.createSystem(command.companyId);
        let systemParams = null;
        try {
            systemParams = await system.send(purchase, user); 
        } catch (err) {
            throw new InternalServerErrorException(err);
        }

        this.purchaseRepository.setAsSentToSystem(purchase.id, systemParams);

        this.publishPurchaseSentToSystemEvent(command);
    }

    private async findPurchase(command: SendPurchaseToSystemCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, id: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException('Compra não encontrada');
        }
        return purchase;
    }

    private async findUser(purchase: Purchase) {
        const user = await this.userRepository.findById(purchase.user.id);
        if (!user) {
            throw new NotFoundException('Cliente não encontrado');
        }
        return user;
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