import { Inject, Injectable } from '@nestjs/common';
import { CompanyStockProduct } from '../models/company-product-stock.model';
import { CompanyStockInterface } from './company-stock.interface';
import { Client } from 'nestjs-soap';

@Injectable()
export class RiccoSaoLuisCompanyStockRepository implements CompanyStockInterface {

  constructor(
  ){}

  async findAll(): Promise<CompanyStockProduct[]> {
    return new Promise(async (resolve, reject) => {
      resolve([]);
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