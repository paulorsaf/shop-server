import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyRepository } from "../../repositories/company.repository";
import { UpdateCompanyAddressCommand } from "./update-company-address.command";
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyAddressUpdatedEvent } from "../../events/company-address-updated.event";

@CommandHandler(UpdateCompanyAddressCommand)
export class UpdateCompanyAddressCommandHandler implements ICommandHandler<UpdateCompanyAddressCommand> {

    constructor(
        private companyRepository: CompanyRepository,
        private eventBus: EventBus
    ){}

    async execute(command: UpdateCompanyAddressCommand) {
        const company = await this.findCompany(command);

        await this.companyRepository.updateAddress(company.id, command.address);

        this.publishCompanyAddressUpdatedEvent(command);
    }

    private async findCompany(command: UpdateCompanyAddressCommand) {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException();
        }
        if (company.id !== command.user.companyId) {
            throw new ForbiddenException();
        }
        return company;
    }

    private publishCompanyAddressUpdatedEvent(command: UpdateCompanyAddressCommand) {
        this.eventBus.publish(
            new CompanyAddressUpdatedEvent(
                command.companyId,
                command.address,
                command.user.id
            )
        );
    }

}