import { Test, TestingModule } from '@nestjs/testing';
import { EmailRepository } from './email.repository';
import * as fs from 'fs';
import * as path from 'path';

xdescribe('EmailRepository', () => {

  let repository: EmailRepository;
  let purchase: any;

  beforeEach(async () => {
    purchase = {
      "products":[
        {
          "name":"Produto teste 1",
          "stock":{
              "color":"#ff0000",
              "companyId":"TOQx2rIfbZ5tav2nS2fg",
              "productId":"Eg7cZN86twyVkO3evQ0M",
              "quantity":51,
              "size":"GG",
              "id":"7I9fkVumTj6vDVI6dSLD"
          },
          "totalPrice":100,
          "amount":1,
          "id":"Eg7cZN86twyVkO3evQ0M",
          "price":100,
          "priceWithDiscount":0,
          "weight":0.8,
          "companyId":"TOQx2rIfbZ5tav2nS2fg"
        },
        {
          "weight":0.8,
          "totalPrice":200,
          "price":100,
          "companyId":"TOQx2rIfbZ5tav2nS2fg",
          "id":"Eg7cZN86twyVkO3evQ0M",
          "name":"Produto teste 1",
          "priceWithDiscount":0,
          "amount":2,
          "stock":{
            "id":"gi3S00dnVtR7VdaV9Qe6",
            "productId":"Eg7cZN86twyVkO3evQ0M",
            "quantity":61,
            "color":"#000000",
            "size":"G",
            "companyId":"TOQx2rIfbZ5tav2nS2fg"
          }
        }
      ],
      "user":{
        "email":"paulorsaf@gmail.com",
        "id":"5S7mFp0roTYZ0kDNNJP5AlK2IFZ2"
      },
      "price":{
        "paymentFee":10.49,
        "totalWithPaymentFee":320.49,
        "products":300,
        "total":310,
        "delivery":10
      },
      "status":"PAID",
      "address":{
        "longitude":-38.4886446,
        "street":"Rua Juiz de Fora",
        "complement":"casa",
        "neighborhood":"Parque Manibura",
        "zipCode":"60.821-700",
        "number":"65",
        "city":"Fortaleza",
        "state":"CE",
        "latitude":-3.7936175
      },
      "companyId":"TOQx2rIfbZ5tav2nS2fg",
      "createdAt":"2022-09-17T06:03:07",
      "payment":{
        "type":"CREDIT_CARD",
        "status":"succeeded",
        "id":"pi_3Liu7SKpQMVMyt0d0ooNTy8I",
        "card":{
          "exp_month":12,
          "last4":"1111",
          "id":"pm_1LiGINKpQMVMyt0dFs51ripz",
          "exp_year":2026,
          "brand":"visa"
        },
        "receiptUrl":"https://pay.stripe.com/receipts/payment/CAcaFwoVYWNjdF8xTGZrVDFLcFFNVk15dDBkKKTGlZkGMgaMjItaZuI6LBYI6dNJ95KZ6wDb-NU3GWA-6mxCWAy4oiiaaOLPBkF_iGixqR0TApPZVTy-"
      },
      "totalAmount":3,
      "company":{
        "email":"paulorsaf@gmail.com"
      }
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailRepository]
    })
    .compile();

    repository = module.get<EmailRepository>(EmailRepository);
  });

  describe('given payment is paid', () => {

    beforeEach(() => {
      purchase.status = "PAID";
    })

    it('then send status change email paid', async () => {
      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/paid.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

  })

  describe('given payment is sorting out', () => {

    beforeEach(() => {
      purchase.status = "SORTING_OUT";
    })

    it('and has address, then send status change email sorting out with address', async () => {
      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/sorting-out-with-address.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

    it('and doesnt have address, then send status change email sorting out without address', async () => {
      purchase.address = null;

      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/sorting-out-without-address.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

  })

  describe('when payment is ready', () => {

    beforeEach(() => {
      purchase.status = "READY";
    })

    it('and has address, then send status change email ready with address', async () => {
      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/ready-with-address.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

    it('and doesnt have address, then send status change email ready without address', async () => {
      purchase.address = null;
      
      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/ready-without-address.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

  })

  describe('when payment is deliverying', () => {

    beforeEach(() => {
      purchase.status = "DELIVERYING";
    })

    it('then send status change email deliverying', async () => {
      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/deliverying.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

  })

  describe('when payment is cancelled', () => {

    beforeEach(() => {
      purchase.status = "CANCELLED";
    })

    it('and has readonly, then send status change email cancelled with reason', async () => {
      purchase.reason = "any reason informed by the user";

      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/cancelled-with-reason.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

    it('and doesnt have reason, then send status change email ready without reason', async () => {
      purchase.reason = null;
      
      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/cancelled-without-reason.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

  })

  describe('given payment is waiting for payment', () => {

    beforeEach(() => {
      purchase.status = "WAITING_PAYMENT";
    })

    it('then send waiting for payment email', async () => {
      const html = await repository.getStatusChangeEmailForClientHtmlClientContent(purchase);
      
      const file = `${path.resolve(__dirname)}/templates/results/status-change-email/waiting-payment.html`;
      await fs.writeFileSync(file, html, 'utf8');
  
      expect(false).toBeTruthy();
    })

  })

});