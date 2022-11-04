import { Injectable } from '@nestjs/common';
import { CompanyStockInterface } from '../repositories/company-stock.interface';
import { RiccoSaoLuisCompanyStockRepository } from '../repositories/ricco-sao-luis-company-stock.repository';

@Injectable()
export class CompanyStockFactory {

  constructor(
    private riccoSaoLuisCompanyStockRepository: RiccoSaoLuisCompanyStockRepository
  ){}

  createStock(companyId: string): CompanyStockInterface {
    return this.riccoSaoLuisCompanyStockRepository;
  }

}