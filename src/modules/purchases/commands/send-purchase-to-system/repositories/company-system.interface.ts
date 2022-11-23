import { Purchase } from "../../../model/purchase.model";
import { User } from "../model/user.model";

export interface CompanySystemInterface {

    send(puchase: Purchase, user: User): Promise<void>;

}