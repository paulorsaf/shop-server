import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyPaymentUpdatedEvent } from "../../events/company-payment-updated.event";
import { CompanyRepository } from "../../repositories/company.repository";
import { UpdateCompanyPaymentCommand } from "./update-company-payment.command";

@CommandHandler(UpdateCompanyPaymentCommand)
export class UpdateCompanyPaymentCommandHandler implements ICommandHandler<UpdateCompanyPaymentCommand> {

    constructor(
        private eventBus: EventBus,
        private companyRepository: CompanyRepository
    ){}

    async execute(command: UpdateCompanyPaymentCommand) {
        await this.verifyCompanyExistsAndBelongsToUser(command);

        await this.companyRepository.updatePayment(command.companyId, command.payment);

        this.publishCompanyPaymentUpdatedEvent(command);
    }

    private async verifyCompanyExistsAndBelongsToUser(command: UpdateCompanyPaymentCommand) {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException();
        }
        if (company.id !== command.user.companyId) {
            throw new ForbiddenException();
        }
        return company;
    }

    private publishCompanyPaymentUpdatedEvent(command: UpdateCompanyPaymentCommand) {
        this.eventBus.publish(
            new CompanyPaymentUpdatedEvent(
                command.companyId,
                command.payment,
                command.user.id
            )
        )
    }

}