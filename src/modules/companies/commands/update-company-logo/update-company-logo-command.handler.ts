import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CompanyRepository } from "../../repositories/company.repository";
import { UpdateCompanyLogoCommand } from "./update-company-logo.command";
import { ForbiddenException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CompanyAddressUpdatedEvent } from "../../events/company-address-updated.event";
import { CompanyLogoUpdatedEvent } from "../../events/company-logo-updated.event";
import { StorageRepository } from "../../repositories/storage.repository";
import { Image } from "../../models/image.model";

@CommandHandler(UpdateCompanyLogoCommand)
export class UpdateCompanyLogoCommandHandler implements ICommandHandler<UpdateCompanyLogoCommand> {

    constructor(
        private companyRepository: CompanyRepository,
        private eventBus: EventBus,
        private storageRepository: StorageRepository
    ){}

    async execute(command: UpdateCompanyLogoCommand) {
        await this.verifyCompanyExistsAndBelongsToUser(command);

        const image = await this.saveImageOnStorage(command);
        await this.companyRepository.updateLogo(command.companyId, image);

        this.publishCompanyLogoUpdatedEvent(command, image);
    }

    private async saveImageOnStorage(command: UpdateCompanyLogoCommand) {
        try {
            const fileName = this.getFileName(command.filePath);
            const image = await this.storageRepository.save({
                companyId: command.companyId,
                filePath: command.filePath,
                name: fileName
            });
            return image;
        } catch (error) {
            throw new InternalServerErrorException("Não foi possível salvar a imagem.");
        }
    }

    private getFileName(filename: string) {
        return "logo" + filename.substring(filename.lastIndexOf('.'))
    }

    private async verifyCompanyExistsAndBelongsToUser(command: UpdateCompanyLogoCommand) {
        const company = await this.companyRepository.findById(command.companyId);
        if (!company) {
            throw new NotFoundException();
        }
        if (company.id !== command.user.companyId) {
            throw new ForbiddenException();
        }
        return company;
    }

    private publishCompanyLogoUpdatedEvent(
        command: UpdateCompanyLogoCommand, image: Image
    ) {
        this.eventBus.publish(
            new CompanyLogoUpdatedEvent(
                command.companyId,
                image,
                command.user.id
            )
        );
    }

}