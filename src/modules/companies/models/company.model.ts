import { Address } from "./address.model";

export class Company {
    
    readonly address: Address;
    readonly email: string;
    readonly id: string;
    readonly logo: Image;
    readonly name: string;
    readonly pixKey: string;

    constructor(params: CompanyParams){
        this.address = params.address;
        this.email = params.email;
        this.id = params.id;
        this.logo = params.logo;
        this.name = params.name;
        this.pixKey = params.pixKey;
    }

}

type CompanyParams = {
    address?: Address;
    email?: string;
    id?: string;
    logo?: Image;
    name?: string;
    pixKey?: string;
}

type Image = {
    fileName: string;
    imageUrl: string;
}