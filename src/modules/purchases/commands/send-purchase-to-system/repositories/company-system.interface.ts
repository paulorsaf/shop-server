import { Purchase } from "../../../model/purchase.model";

export interface CompanySystemInterface {

    send(puchase: Purchase): Promise<void>;

}