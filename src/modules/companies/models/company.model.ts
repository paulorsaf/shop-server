import { Address } from "./address.model";

export class Company {
    
    readonly aboutUs: string;
    readonly address: Address;
    readonly email: string;
    readonly id: string;
    readonly logo: Image;
    readonly name: string;
    readonly payment: Payment;
    readonly facebook: string;
    readonly instagram: string;
    readonly website: string;
    readonly whatsapp: string;

    constructor(params: CompanyParams){
        this.aboutUs = params.aboutUs;
        this.address = params.address;
        this.email = params.email;
        this.id = params.id;
        this.logo = params.logo;
        this.name = params.name;
        this.payment = params.payment;
        this.facebook = params.facebook;
        this.instagram = params.instagram;
        this.website = params.website;
        this.whatsapp = params.whatsapp;
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
    facebook?: string;
    instagram?: string;
    website?: string;
    whatsapp?: string;
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