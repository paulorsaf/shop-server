import { Injectable } from '@nestjs/common';
import { CompanySystemInterface } from './company-system.interface';
import { Purchase } from '../../../model/purchase.model';
import { RiccoCompanySystem } from '../model/ricco-system.model';
import { User } from '../model/user.model';
import { getEnvProperty } from '../../../../../utils/env.utils';
import * as xml2js from 'xml2js';
import fetch from 'node-fetch';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class RiccoImperatrizCompanySystemRepository implements CompanySystemInterface {

  constructor(
    private readonly httpService: HttpService
  ){}

  async send(purchase: Purchase, user: User): Promise<any> {
    let payload = new RiccoCompanySystem(purchase, user);
    payload.itemObj[0].id = null;
    
    return new Promise(async (resolve, reject) => {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${getEnvProperty('COMPANY_STOCK_RICCO_IMPERATRIZ')}/VendaApp`,
          `json=${JSON.stringify(payload)}`,
          { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        ).pipe(catchError(() => {throw 'Erro ao enviar compra para o sistema'}))
      )

      xml2js.parseStringPromise(data).then(json => {
        const response = JSON.parse(json.string._);
        if (response.codigo === 0) {
          return reject({message: response.texto});
        }
        resolve(payload);
      }).catch(() => {
        reject({message: 'Erro ao enviar compra para o sistema'})
      });
    })
  }

}