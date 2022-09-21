export class Client {

    readonly id: string;

    readonly cpfCnpj: string;
    readonly createdAt: string;
    readonly email: string;
    readonly name: string;
    readonly phone: string;

    constructor(params: ClientParams){
        this.id = params.id;
        this.cpfCnpj = params.cpfCnpj;
        this.createdAt = params.createdAt;
        this.email = params.email;
        this.name = params.name;
        this.phone = params.phone;
    }

}

type ClientParams = {
    id: string;
    cpfCnpj: string;
    createdAt: string;
    email: string;
    name: string;
    phone: string;
}