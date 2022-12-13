import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyRepository } from "../../repositories/company.repository";
import { UpdateCompanyDeliveryPriceCommand } from "./update-company-delivery-price.command";
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CompanyCityDeliveryPriceUpdatedEvent } from "../../events/company-city-delivery-price-updated.event";

@CommandHandler(UpdateCompanyDeliveryPriceCommand)
export class UpdateCompanyDeliveryPriceCommandHandler implements ICommandHandler<UpdateCompanyDeliveryPriceCommand> {

    constructor(
        private companyRepository: CompanyRepository,
        private eventBus: EventBus
    ){}

    async execute(command: UpdateCompanyDeliveryPriceCommand) {
        const company = await this.findCompany(command);

        await this.companyRepository.updateCityDeliveryPrice(company.id, command.price);

        this.publishCompanyCityDeliveryPriceUpdatedEvent(command);
    }

    private async findCompany(command: UpdateCompanyDeliveryPriceCommand) {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException();
        }
        if (company.id !== command.companyId) {
            throw new ForbiddenException();
        }
        return company;
    }

    private publishCompanyCityDeliveryPriceUpdatedEvent(command: UpdateCompanyDeliveryPriceCommand) {
        this.eventBus.publish(
            new CompanyCityDeliveryPriceUpdatedEvent(
                command.companyId,
                command.price,
                command.userId
            )
        );
    }

}