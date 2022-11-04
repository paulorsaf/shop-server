import { CompanyStockProduct } from "../models/company-product-stock.model";

export interface CompanyStockInterface {

    findAll(): Promise<CompanyStockProduct[]>;

}