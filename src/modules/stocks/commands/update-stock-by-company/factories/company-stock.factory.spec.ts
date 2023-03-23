import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { SoapModule } from 'nestjs-soap';
import { RiccoImperatrizCompanyStockRepository } from '../repositories/ricco-imperatriz-company-stock.repository';
import { RiccoSaoLuisCompanyStockRepository } from '../repositories/ricco-sao-luis-company-stock.repository';
import { CompanyStockFactory } from './company-stock.factory';

describe('CompanyStockFactory', () => {

    let factory: CompanyStockFactory;

    let riccoImperatrizCompanyStockRepositosMock = {id: 1};
    let riccoSaoLuisCompanyStockRepositosMock = {id: 2};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                SoapModule.register({
                    clientName: 'RICCO_SAO_LUIS_STOCK',
                    uri: "any"
                })
            ],
            providers: [
                CompanyStockFactory,
                RiccoImperatrizCompanyStockRepository,
                RiccoSaoLuisCompanyStockRepository
            ]
        })
        .overrideProvider(RiccoImperatrizCompanyStockRepository).useValue(riccoImperatrizCompanyStockRepositosMock)
        .overrideProvider(RiccoSaoLuisCompanyStockRepository).useValue(riccoSaoLuisCompanyStockRepositosMock)
        .compile();

        factory = module.get<CompanyStockFactory>(CompanyStockFactory);
    });

    it('given company is ricco sao luis, then return ricco sao luis', async () => {
        expect(factory.createStock('ZHcTZOE3HqGilGhNcgUR'))
            .toEqual(riccoSaoLuisCompanyStockRepositosMock);
    });

    it('given company is ricco imperatriz, then return ricco imperatriz', async () => {
        expect(factory.createStock('yYRhNlwkCAWSBztRo887'))
            .toEqual(riccoImperatrizCompanyStockRepositosMock);
    });

    it('given company is not found, then return null', async () => {
        expect(factory.createStock('anyCompanyId'))
            .toBeNull();
    });

});