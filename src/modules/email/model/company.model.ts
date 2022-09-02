export class Company {
    
    readonly email: string;
    readonly name: string;

    constructor(param: CompanyParam) {
        this.email = param.email;
        this.name = param.name;
    }

}

type CompanyParam = {
    email: string;
    name: string;
}