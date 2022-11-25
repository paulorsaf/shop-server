import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'nestjs-soap';
import { CompanySystemInterface } from './company-system.interface';
import { Purchase } from './../../../model/purchase.model';
import { RiccoCompanySystem } from '../model/ricco-system.model';
import { User } from '../model/user.model';

@Injectable()
export class RiccoSaoLuisCompanySystemRepository implements CompanySystemInterface {

  constructor(
    @Inject('RICCO_SAO_LUIS_STOCK') private readonly soapClient: Client
  ){}

  async send(purchase: Purchase, user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.soapClient.wsdl.xmlnsInEnvelope.includes(":tem")) {
        this.soapClient.wsdl.xmlnsInEnvelope += ' xmlns:tem="http://tempuri.org/"';
      }
  
      let payload = new RiccoCompanySystem(purchase, user);
  
      return this.soapClient.VendaApp({
        'tem:json': JSON.stringify(payload)
      }, (err, res) => {
        if (err) {
          return reject({message: err});
        }
        const response = JSON.parse(res.VendaAppResult);
        if (response.codigo === 0) {
          return reject({message: response.texto});
        }
        resolve(payload);
      });
    });
  }

}