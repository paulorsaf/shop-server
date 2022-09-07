import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ZipCodeNotFoundException } from "../../exceptions/zipcode-not-found.exception";
import { AddressRepository } from "../../repositories/address.repository";
import { FindAddressByZipcodeQuery } from "./find-address-by-zipcode.query";

@QueryHandler(FindAddressByZipcodeQuery)
export class FindAddressByZipcodeQueryHandler implements IQueryHandler<FindAddressByZipcodeQuery> {

    constructor(
        private addressRepository: AddressRepository
    ){}

    async execute(query: FindAddressByZipcodeQuery) {
        try {
            const address = await this.addressRepository.findByZipCode(query.zipCode);
            if (!address) {
                throw new ZipCodeNotFoundException();
            }
            return address;
        } catch (error) {
            throw new ZipCodeNotFoundException();
        }
    }

}