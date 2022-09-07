import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { AddressRepository } from '../../repositories/address.repository';
import { FindAddressByZipcodeQueryHandler } from './find-address-by-zipcode-query.handler';
import { FindAddressByZipcodeQuery } from './find-address-by-zipcode.query';

describe('FindAddressByZipcodeQueryHandler', () => {

  let handler: FindAddressByZipcodeQueryHandler;

  let command = new FindAddressByZipcodeQuery('anyZipCode');
  let addressRepository: AddressRepositoryMock;

  beforeEach(async () => {
    addressRepository = new AddressRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindAddressByZipcodeQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        AddressRepository
      ]
    })
    .overrideProvider(AddressRepository).useValue(addressRepository)
    .compile();

    handler = module.get<FindAddressByZipcodeQueryHandler>(FindAddressByZipcodeQueryHandler);
  });

  it('given zipcode found, then return address', async () => {
    const address = {id: "anyAddress"};
    addressRepository._response = address;

    const response = await handler.execute(command);

    expect(response).toEqual(address);
  });

  it('given zipcode not found, then throw zipcode not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given exception on finding zipcode, then throw zipcode not found exception', async () => {
    addressRepository._response = Promise.reject({});

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

});

class AddressRepositoryMock {
  _response;
  findByZipCode() {
    return this._response;
  }
}