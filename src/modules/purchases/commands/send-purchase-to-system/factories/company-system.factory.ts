import { Injectable } from '@nestjs/common';
import { CompanySystemInterface } from '../repositories/company-system.interface';
import { RiccoImperatrizCompanySystemRepository } from '../repositories/ricco-imperatriz-company-system.repository';
import { RiccoSaoLuisCompanySystemRepository } from '../repositories/ricco-sao-luis-company-system.repository';

@Injectable()
export class CompanySystemFactory {

  constructor(
    private riccoImperatrizCompanySystemRepository: RiccoImperatrizCompanySystemRepository,
    private riccoSaoLuisCompanySystemRepository: RiccoSaoLuisCompanySystemRepository
  ){}

  createSystem(companyId: string): CompanySystemInterface {
    if (companyId === "ZHcTZOE3HqGilGhNcgUR") {
      return this.riccoSaoLuisCompanySystemRepository;
    } else if (companyId === "yYRhNlwkCAWSBztRo887") {
      return this.riccoImperatrizCompanySystemRepository;
    }
    return null;
  }

}