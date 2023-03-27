import { Address } from "./address.model";

export class Company {
    
    readonly aboutUs: string;
    readonly address: Address;
    readonly canUpdateStock: boolean;
    readonly cityDeliveryPrice: number;
    readonly email: string;
    readonly hasToSendPurchaseToOwnSystem: boolean;
    readonly id: string;
    readonly logo: Image;
    readonly name: string;
    readonly payment: Payment;
    readonly facebook: string;
    readonly instagram: string;
    readonly serviceTax: number;
    readonly website: string;
    readonly whatsapp: string;

    constructor(params: CompanyParams){
        this.aboutUs = params.aboutUs;
        this.address = params.address;
        this.canUpdateStock = params.canUpdateStock;
        this.cityDeliveryPrice = params.cityDeliveryPrice;
        this.email = params.email;
        this.hasToSendPurchaseToOwnSystem = params.hasToSendPurchaseToOwnSystem;
        this.id = params.id;
        this.logo = params.logo;
        this.name = params.name;
        this.payment = params.payment;
        this.facebook = params.facebook;
        this.instagram = params.instagram;
        this.serviceTax = params.serviceTax;
        this.website = params.website;
        this.whatsapp = params.whatsapp;
    }

}

type CompanyParams = {
    aboutUs?: string;
    address?: Address;
    canUpdateStock?: boolean;
    cityDeliveryPrice?: number;
    email?: string;
    hasToSendPurchaseToOwnSystem?: boolean;
    id?: string;
    logo?: Image;
    name?: string;
    payment?: Payment;
    facebook?: string;
    instagram?: string;
    serviceTax?: number;
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