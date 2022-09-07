import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyRepository } from "../../repositories/company.repository";
import { UpdateCompanyAboutUsCommand } from "./update-company-about-us.command";
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyAboutUsUpdatedEvent } from "../../events/company-about-us-updated.event";

@CommandHandler(UpdateCompanyAboutUsCommand)
export class UpdateCompanyAboutUsCommandHandler implements ICommandHandler<UpdateCompanyAboutUsCommand> {

    constructor(
        private companyRepository: CompanyRepository,
        private eventBus: EventBus
    ){}

    async execute(command: UpdateCompanyAboutUsCommand) {
        const company = await this.findCompany(command);

        await this.companyRepository.updateAboutUs(company.id, command.html);

        this.publishCompanyAboutUsUpdatedEvent(command);
    }

    private async findCompany(command: UpdateCompanyAboutUsCommand) {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException();
        }
        if (company.id !== command.user.companyId) {
            throw new ForbiddenException();
        }
        return company;
    }

    private publishCompanyAboutUsUpdatedEvent(command: UpdateCompanyAboutUsCommand) {
        this.eventBus.publish(
            new CompanyAboutUsUpdatedEvent(
                command.companyId,
                command.html,
                command.user.id
            )
        );
    }

}