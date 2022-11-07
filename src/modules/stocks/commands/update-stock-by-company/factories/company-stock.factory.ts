import { Injectable } from '@nestjs/common';
import { CompanyStockInterface } from '../repositories/company-stock.interface';
import { RiccoImperatrizCompanyStockRepository } from '../repositories/ricco-imperatriz-company-stock.repository';
import { RiccoSaoLuisCompanyStockRepository } from '../repositories/ricco-sao-luis-company-stock.repository';

@Injectable()
export class CompanyStockFactory {

  constructor(
    private riccoImperatrizCompanyStockRepository: RiccoImperatrizCompanyStockRepository,
    private riccoSaoLuisCompanyStockRepository: RiccoSaoLuisCompanyStockRepository
  ){}

  createStock(companyId: string): CompanyStockInterface {
    if (companyId === "ZHcTZOE3HqGilGhNcgUR") {
      return this.riccoSaoLuisCompanyStockRepository;
    } else if (companyId === "yYRhNlwkCAWSBztRo887") {
      return this.riccoImperatrizCompanyStockRepository;
    }
    return null;
  }

}