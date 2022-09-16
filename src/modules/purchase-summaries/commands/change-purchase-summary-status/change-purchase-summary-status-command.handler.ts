import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { format } from "date-fns";
import { PurchaseSummaryRepository } from "../../repositories/purchase-summary.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { ChangePurchaseSummaryStatusCommand } from "./change-purchase-summary-status.command";

@CommandHandler(ChangePurchaseSummaryStatusCommand)
export class ChangePurchaseSummaryStatusCommandHandler implements ICommandHandler<ChangePurchaseSummaryStatusCommand> {

    constructor(
        private purchaseRepository: PurchaseRepository,
        private purchaseSummaryRepository: PurchaseSummaryRepository
    ){}

    async execute(command: ChangePurchaseSummaryStatusCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, id: command.purchaseId
        });

        if (purchase) {
            const dailyPurchaseSummary = await this.purchaseSummaryRepository.findByCompanyIdAndDate({
                companyId: command.companyId,
                date: format(new Date(purchase.createdAt), 'yyyy-MM-dd')
            });

            await this.purchaseSummaryRepository.updateStatus({
                dailyPurchaseId: dailyPurchaseSummary.id,
                purchase
            })
        }
    }

}