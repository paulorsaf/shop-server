import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { BannerRepository } from "../../repositories/banner.repository";
import { CreateBannerDetailCommand } from "./create-banner-detail.command";
import { BannerDetailCreatedEvent } from "./events/banner-detail-created.event";

@CommandHandler(CreateBannerDetailCommand)
export class CreateBannerDetailCommandHandler implements ICommandHandler<CreateBannerDetailCommand> {

    constructor(
        private bannerRepository: BannerRepository,
        private eventBus: EventBus
    ){}

    async execute(command: CreateBannerDetailCommand) {
        const bannerId = await this.bannerRepository.save({
            companyId: command.companyId,
            productId: command.productId,
            createdBy: command.createdBy
        })

        this.eventBus.publish(
            new BannerDetailCreatedEvent(
                command.companyId, {
                    id: bannerId, 
                    productId: command.productId
                }, command.createdBy
            )
        )
    }

}