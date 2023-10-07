import { BadRequestException } from "@nestjs/common";

export class WrongFileTypeException extends BadRequestException {

    constructor(type: string){
        super(`Arquivo deve ser do tipo ${type}.`);
    }

}