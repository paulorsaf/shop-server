import { Purchase } from "./purchase.model"

describe('Purchases - Purchase model', () => {

    let purchase: Purchase;

    describe('given update status', () => {

        it('then set new status', () => {
            purchase = new Purchase({
                companyId: "anyCompanyId",
                status: "anyStatus"
            })

            purchase.updateStatus("anyOtherStatus");

            expect(purchase.getStatus()).toEqual("anyOtherStatus");
        })

    })

})