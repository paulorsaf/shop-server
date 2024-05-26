import { Inject, Injectable } from '@nestjs/common';
import { Client } from 'nestjs-soap';
import { CompanySystemInterface } from './company-system.interface';
import { Purchase } from './../../../model/purchase.model';
import { RiccoCompanySystem } from '../model/ricco-system.model';
import { User } from '../model/user.model';

@Injectable()
export class RiccoSaoLuisCompanySystemRepository implements CompanySystemInterface {

  constructor(
  ){}

  async send(purchase: Purchase, user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }

}