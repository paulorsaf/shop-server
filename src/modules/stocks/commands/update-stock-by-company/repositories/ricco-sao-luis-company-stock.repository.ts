import { Inject, Injectable } from '@nestjs/common';
import { CompanyStockProduct } from '../models/company-product-stock.model';
import { CompanyStockInterface } from './company-stock.interface';
import { Client } from 'nestjs-soap';

@Injectable()
export class RiccoSaoLuisCompanyStockRepository implements CompanyStockInterface {

  constructor(
    @Inject('RICCO_SAO_LUIS_STOCK') private readonly soapClient: Client
  ){}

  async findAll(): Promise<CompanyStockProduct[]> {
    return new Promise(async (resolve, reject) => {
      if (!this.soapClient.wsdl.xmlnsInEnvelope.includes(":tem")) {
        this.soapClient.wsdl.xmlnsInEnvelope += ' xmlns:tem="http://tempuri.org/"';
      }

      this.soapClient.CadastroProdutoApp({
        'tem:loja': 1
      }, (err, res) => {
        if (err) {
          resolve([]);
          return;
        }
        const values = JSON.parse(res.CadastroProdutoAppResult);
        const response = values.map(v => ({
          isPromotion: v.promocao ? true : false,
          price: v.preco1,
          productInternalId: v.codigo.toString(),
          totalStock: v.saldo
        }));
        resolve(response);
      });
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