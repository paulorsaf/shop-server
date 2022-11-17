import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { CompanyStockProduct } from '../models/company-product-stock.model';
import { CompanyStockInterface } from './company-stock.interface';
import * as xml2js from 'xml2js';
import { catchError, firstValueFrom } from 'rxjs';
import { getEnvProperty } from '../../../../../utils/env.utils';

@Injectable()
export class RiccoImperatrizCompanyStockRepository implements CompanyStockInterface {

  #url = getEnvProperty('COMPANY_STOCK_RICCO_IMPERATRIZ');

  constructor(
    private readonly httpService: HttpService
  ){}

  async findAll(): Promise<CompanyStockProduct[]> {
    return new Promise(async (resolve, reject) => {
      const { data } = await firstValueFrom(
        this.httpService.get(this.#url).pipe(
          catchError(() => {
            throw 'An error happened!';
          })
        )
      )
      
      xml2js.parseStringPromise(data).then(json => {
        const values = JSON.parse(json.string._) as Response[];
        resolve(values.map(v => ({
          isPromotion: v.promocao ? true : false,
          price: v.preco1,
          productInternalId: v.codigo.toString(),
          totalStock: v.saldo
        })));
      }).catch(error => reject(error));
    })
  }

}

type Response = {
  codigo: number;
  nome: string;
  saldo: number;
  preco1: number;
  promocao: number;
}