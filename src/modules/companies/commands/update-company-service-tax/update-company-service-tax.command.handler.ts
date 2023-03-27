import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyRepository } from "../../repositories/company.repository";
import { UpdateCompanyServiceTaxCommand } from "./update-company-service-tax.command";
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyServiceTaxUpdatedEvent } from "../../events/company-service-tax-updated.event";

@CommandHandler(UpdateCompanyServiceTaxCommand)
export class UpdateCompanyServiceTaxCommandHandler implements ICommandHandler<UpdateCompanyServiceTaxCommand> {

    constructor(
        private companyRepository: CompanyRepository,
        private eventBus: EventBus
    ){}

    async execute(command: UpdateCompanyServiceTaxCommand) {
        await this.findCompany(command);

        await this.companyRepository.updateServiceTax(command.companyId, command.serviceTax);

        this.publishCompanyServiceTaxUpdatedEvent(command);
    }

    private async findCompany(command: UpdateCompanyServiceTaxCommand) {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException();
        }
        if (company.id !== command.user.companyId) {
            throw new ForbiddenException();
        }
        return company;
    }

    private publishCompanyServiceTaxUpdatedEvent(command: UpdateCompanyServiceTaxCommand) {
        this.eventBus.publish(
            new CompanyServiceTaxUpdatedEvent(
                command.companyId,
                command.serviceTax,
                command.user.id
            )
        );
    }

}