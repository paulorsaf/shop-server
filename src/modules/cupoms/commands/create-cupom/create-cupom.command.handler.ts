import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CupomCreatedEvent } from "../../events/cupom-created.event";
import { Cupom } from "../../models/cupom.model";
import { CupomRepository } from "../../repositories/cupom.repository";
import { CreateCupomCommand } from "./create-cupom.command";

@CommandHandler(CreateCupomCommand)
export class CreateCupomCommandHandler implements ICommandHandler<CreateCupomCommand> {

    constructor(
        private cupomRepository: CupomRepository,
        private eventBus: EventBus
    ){}

    async execute(command: CreateCupomCommand) {
        const cupom: Cupom = this.createCupomModel(command);

        const id = await this.cupomRepository.create(cupom);

        this.publishCupomCreatedEvent(command, cupom, id);
    }

    private createCupomModel(command: CreateCupomCommand) {
        const cupom: Cupom = {
            amountLeft: command.cupom.amountLeft,
            companyId: command.companyId,
            cupom: command.cupom.cupom.toUpperCase(),
            discount: command.cupom.discount,
            expireDate: command.cupom.expireDate
        }
        return cupom;
    }

    private publishCupomCreatedEvent(command: CreateCupomCommand, cupom: Cupom, id: string) {
        this.eventBus.publish(
            new CupomCreatedEvent(
                command.companyId,
                {
                    ...cupom,
                    id
                },
                command.userId
            )
        )
    }

}