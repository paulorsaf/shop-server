import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyRepository } from "../../repositories/company.repository";
import { UpdateCompanyCommand } from "./update-company.command";
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyUpdatedEvent } from "../../events/company-updated.event";

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyCommandHandler implements ICommandHandler<UpdateCompanyCommand> {

    constructor(
        private companyRepository: CompanyRepository,
        private eventBus: EventBus
    ){}

    async execute(command: UpdateCompanyCommand) {
        const company = await this.findCompany(command);

        await this.companyRepository.update(company.id, command.company);

        this.publishCompanyUpdatedEvent(command);
    }

    private async findCompany(command: UpdateCompanyCommand) {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException();
        }
        if (company.id !== command.user.companyId) {
            throw new ForbiddenException();
        }
        return company;
    }

    private publishCompanyUpdatedEvent(command: UpdateCompanyCommand) {
        this.eventBus.publish(
            new CompanyUpdatedEvent(
                command.companyId,
                command.company,
                command.user.id
            )
        );
    }

}