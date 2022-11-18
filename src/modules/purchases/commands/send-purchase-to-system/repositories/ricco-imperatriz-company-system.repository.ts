import { Injectable } from '@nestjs/common';
import { CompanySystemInterface } from './company-system.interface';
import { Purchase } from '../../../model/purchase.model';

@Injectable()
export class RiccoImperatrizCompanySystemRepository implements CompanySystemInterface {

  async send(purchase: Purchase): Promise<void> {
    
  }

}