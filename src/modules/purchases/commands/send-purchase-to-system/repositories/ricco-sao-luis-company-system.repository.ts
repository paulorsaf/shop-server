import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'nestjs-soap';
import { CompanySystemInterface } from './company-system.interface';
import { Purchase } from './../../../model/purchase.model';

@Injectable()
export class RiccoSaoLuisCompanySystemRepository implements CompanySystemInterface {

  constructor(
    @Inject('RICCO_SAO_LUIS_STOCK') private readonly soapClient: Client
  ){}

  async send(purchase: Purchase): Promise<void> {
    
  }

}