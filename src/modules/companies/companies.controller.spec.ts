import { CommandBus, CqrsModule, QueryBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { CompaniesController } from './companies.controller';
import { User } from '../../authentication/model/user';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindCompanyByIdQuery } from './queries/find-company-by-id/find-company-by-id.query';
import { UpdateCompanyAddressCommand } from './commands/update-company-address/update-company-address.command';
import { UpdateCompanyCommand } from './commands/update-company/update-company.command';
import { UpdateCompanyLogoCommand } from './commands/update-company-logo/update-company-logo.command';
import { UpdateCompanyAboutUsCommand } from './commands/update-company-about-us/update-company-about-us.command';
import { UpdateCompanyPaymentCommand } from './commands/update-company-payment/update-company-payment.command';
import { UpdateCompanyDeliveryPriceCommand } from './commands/update-company-delivery-price/update-company-delivery-price.command';
import { UpdateCompanyServiceTaxCommand } from './commands/update-company-service-tax/update-company-service-tax.command';

describe('CompaniesController', () => {

  let controller: CompaniesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const user = <User> {id: 'anyUserId', companyId: 'anyCompanyId'};

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CompaniesController
      ],
      imports: [
        CqrsModule,
        AuthenticationModule
      ],
      providers: [

      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<CompaniesController>(CompaniesController);
  });

  describe('given find company by user', () => {

    it('then execute find company by id query', () => {
      controller.findById(user, "anyName");
  
      expect(queryBus.executed).toEqual(
        new FindCompanyByIdQuery(
          "anyCompanyId", {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  })

  describe('given find company by id', () => {

    it('then execute find company by id query', () => {
      controller.findById(user, "anyName");
  
      expect(queryBus.executed).toEqual(
        new FindCompanyByIdQuery(
          "anyCompanyId", {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  })

  describe('given update company', () => {

    it('then execute update company command', () => {
      let details = {name: "anyName"} as any;
      controller.update(user, "anyId", details);
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyCommand(
          "anyId",
          details,
          {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  });

  describe('given update company about us', () => {

    it('then execute update company about us command', () => {
      controller.updateAboutUs(user, "anyId", "anyHtml");
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyAboutUsCommand(
          "anyId",
          "anyHtml",
          {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  })

  describe('given update company address', () => {

    it('then execute update company address command', () => {
      const address = {id: "anyAddress"} as any;

      controller.updateAddress(user, "anyId", address);
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyAddressCommand(
          "anyId",
          address,
          {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  })

  describe('given update company logo', () => {

    it('then execute update company logo command', () => {
      controller.updateLogo(user, "anyId", "anyFileName");
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyLogoCommand(
          "anyId", "anyFileName", {
            companyId: "anyCompanyId", id: "anyUserId"
          }
        )
      );
    });

  })

  describe('given update company payment', () => {

    it('then execute update company payment command', () => {
      const payment = {
        creditCard: "anyCreditCard", money: "anyMoney", pixKey: "anyPixKey"
      } as any;
      controller.updatePayment(user, "anyId", payment);
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyPaymentCommand(
          "anyId", {
            creditCard: payment.creditCard,
            money: payment.money,
            pixKey: payment.pixKey
          } as any, {
            companyId: "anyCompanyId",
            id: "anyUserId"
          }
        )
      );
    });

  })

  describe('given update delivery price', () => {

    it('then execute update delivery price command', () => {
      controller.updateDeliveryPrice(user, {hasDeliveryByMail: true, price: 10});
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyDeliveryPriceCommand(
          "anyCompanyId", 10, true, "anyUserId"
        )
      );
    });

  })

  describe('given update service tax', () => {

    it('then execute update service tax command', () => {
      controller.updateServiceTax(user, {serviceTax: 10});
  
      expect(commandBus.executed).toEqual(
        new UpdateCompanyServiceTaxCommand(
          "anyCompanyId", 10, {companyId: "anyCompanyId", id: "anyUserId"}
        )
      );
    });

  })

});
