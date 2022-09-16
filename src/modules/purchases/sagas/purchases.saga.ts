import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { ChangePurchaseSummaryStatusCommand } from "../../purchase-summaries/commands/change-purchase-summary-status/change-purchase-summary-status.command";
import { SendEmailOnPurchaseStatusChangeCommand } from "../../email/commands/send-email-on-purchase-status-change/send-email-on-purchase-status-change.command";
import { PurchaseStatusUpdatedEvent } from "../events/purchase-status-updated.event";

@Injectable()
export class PurchasesSagas {

    @Saga()
    purchaseStatusUpdated = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseStatusUpdatedEvent),
            map(event =>
                new SendEmailOnPurchaseStatusChangeCommand(
                    event.companyId,
                    event.purchaseId,
                    event.status
                )
            )
        );

    @Saga()
    purchaseStatusUpdatePurchaseSummary = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseStatusUpdatedEvent),
            map(event =>
                new ChangePurchaseSummaryStatusCommand(
                    event.companyId,
                    event.purchaseId
                )
            )
        );

}