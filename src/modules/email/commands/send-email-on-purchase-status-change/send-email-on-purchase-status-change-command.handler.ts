import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { NotFoundException } from "@nestjs/common";
import { EmailRepository } from "../../repositories/email.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SendEmailOnPurchaseStatusChangeCommand } from "./send-email-on-purchase-status-change.command";
import { PurchaseStatusChangeEmailSentEvent } from "../../events/purchase-status-change-email-sent.event";
import { SendPurchaseStatusChangeEmailFailedEvent } from "../../events/send-purchase-status-change-email-failed.event";

@CommandHandler(SendEmailOnPurchaseStatusChangeCommand)
export class SendEmailOnPurchaseStatusChangeCommandHandler implements ICommandHandler<SendEmailOnPurchaseStatusChangeCommand> {

    private validEmailStatuses = [
        "WAITING_PAYMENT", "PAID", "SORTING_OUT", "READY", "DELIVERYING", "CANCELLED"
    ];

    constructor(
        private eventBus: EventBus,
        private emailRepository: EmailRepository,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SendEmailOnPurchaseStatusChangeCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, purchaseId: command.purchaseId
        })
        if (!purchase) {
            throw new NotFoundException("Compra não encontrada");
        }
        if (!this.validEmailStatuses.includes(purchase.status)) {
            return;
        }

        try {
            await this.emailRepository.sendStatusChangeEmail(purchase);
            this.publishPurchaseStatusChangeEmailSentEvent(command);
        } catch (error) {
            this.publishSendPurchaseStatusChangeEmailFailedEvent(command, error);
        }
    }

    private publishPurchaseStatusChangeEmailSentEvent(
        command: SendEmailOnPurchaseStatusChangeCommand
    ) {
        this.eventBus.publish(
            new PurchaseStatusChangeEmailSentEvent(
                command.companyId,
                command.purchaseId,
                command.status
            )
        )
    }

    private publishSendPurchaseStatusChangeEmailFailedEvent(
        command: SendEmailOnPurchaseStatusChangeCommand, error: any
    ) {
        this.eventBus.publish(
            new SendPurchaseStatusChangeEmailFailedEvent(
                command.companyId,
                command.purchaseId,
                command.status,
                error
            )
        )
    }

}