import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { BannerRepository } from "../../repositories/banner.repository";
import { DeleteBannerDetailCommand } from "./delete-banner-detail.command";
import { BannerDetailDeletedEvent } from "./events/banner-detail-deleted.event";

@CommandHandler(DeleteBannerDetailCommand)
export class DeleteBannerDetailCommandHandler implements ICommandHandler<DeleteBannerDetailCommand> {

    constructor(
        private bannerRepository: BannerRepository,
        private eventBus: EventBus
    ){}

    async execute(command: DeleteBannerDetailCommand) {
        await this.verifyBannerExistsAndBelongsToCompany(command);

        await this.bannerRepository.delete(command.bannerId);

        this.eventBus.publish(
            new BannerDetailDeletedEvent(
                command.companyId, command.bannerId, command.deletedBy
            )
        )
    }

    async verifyBannerExistsAndBelongsToCompany(command: DeleteBannerDetailCommand) {
        const banner = await this.bannerRepository.findById(command.bannerId);
        if (!banner) {
            throw new NotFoundException();
        }
        if (banner.companyId !== command.companyId) {
            throw new UnauthorizedException();
        }
    }

}