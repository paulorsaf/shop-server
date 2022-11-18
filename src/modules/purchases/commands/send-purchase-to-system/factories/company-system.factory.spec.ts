import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { SoapModule } from 'nestjs-soap';
import { RiccoImperatrizCompanySystemRepository } from '../repositories/ricco-imperatriz-company-system.repository';
import { RiccoSaoLuisCompanySystemRepository } from '../repositories/ricco-sao-luis-company-system.repository';
import { CompanySystemFactory } from './company-system.factory';

describe('CompanySystemFactory', () => {

    let factory: CompanySystemFactory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                HttpModule,
                SoapModule.register({
                    clientName: 'RICCO_SAO_LUIS_STOCK',
                    uri: "any"
                })
            ],
            providers: [
                CompanySystemFactory,
                RiccoImperatrizCompanySystemRepository,
                RiccoSaoLuisCompanySystemRepository
            ]
        })
        .compile();

        factory = module.get<CompanySystemFactory>(CompanySystemFactory);
    });

    it('given company is ricco sao luis, then return ricco sao luis', async () => {
        expect(factory.createSystem('ZHcTZOE3HqGilGhNcgUR'))
            .toBeInstanceOf(RiccoSaoLuisCompanySystemRepository);
    });

    it('given company is ricco imperatriz, then return ricco imperatriz', async () => {
        expect(factory.createSystem('yYRhNlwkCAWSBztRo887'))
            .toBeInstanceOf(RiccoImperatrizCompanySystemRepository);
    });

    it('given company is not found, then return null', async () => {
        expect(factory.createSystem('anyCompanyId'))
            .toBeNull();
    });

});