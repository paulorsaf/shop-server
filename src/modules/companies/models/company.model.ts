import { Address } from "./address.model";

export class Company {
    
    readonly aboutUs: string;
    readonly address: Address;
    readonly email: string;
    readonly id: string;
    readonly logo: Image;
    readonly name: string;
    readonly payment: Payment;
    readonly pixKey: string;

    constructor(params: CompanyParams){
        this.aboutUs = params.aboutUs;
        this.address = params.address;
        this.email = params.email;
        this.id = params.id;
        this.logo = params.logo;
        this.name = params.name;
        this.payment = params.payment;
        this.pixKey = params.pixKey;
    }

}

type CompanyParams = {
    aboutUs?: string;
    address?: Address;
    email?: string;
    id?: string;
    logo?: Image;
    name?: string;
    payment?: Payment;
    pixKey?: string;
}

type Image = {
    fileName: string;
    imageUrl: string;
}

type Payment = {
    creditCard: {
        fee: {
            percentage: number;
            value: number;
        },
        flags: string[]
    },
    money: boolean;
    pixKey: string;
}