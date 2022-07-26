import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { BannerRepository } from "../../repositories/banner.repository";
import { BannerDetailUpdatedEvent } from "./events/banner-detail-updated.event";
import { UpdateBannerDetailCommand } from "./update-banner-detail.command";

@CommandHandler(UpdateBannerDetailCommand)
export class UpdateBannerDetailCommandHandler implements ICommandHandler<UpdateBannerDetailCommand> {

    constructor(
        private bannerRepository: BannerRepository,
        private eventBus: EventBus
    ){}

    async execute(command: UpdateBannerDetailCommand) {
        await this.verifyBannerExistsAndBelongsToCompany(command);
        
        await this.bannerRepository.update({
            id: command.banner.id,
            productId: command.banner.productId,
            updatedBy: command.updatedBy
        });

        this.eventBus.publish(
            new BannerDetailUpdatedEvent(
                command.companyId, {
                    id: command.banner.id,
                    productId: command.banner.productId
                }, command.updatedBy
            )
        )
    }

    private async verifyBannerExistsAndBelongsToCompany(command: UpdateBannerDetailCommand) {
        const banner = await this.bannerRepository.findById(command.banner.id);
        if (!banner) {
            throw new NotFoundException();
        }
        if (banner.companyId !== command.companyId) {
            throw new UnauthorizedException();
        }
    }

}