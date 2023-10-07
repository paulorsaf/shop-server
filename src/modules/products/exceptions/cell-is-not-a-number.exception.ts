import { BadRequestException } from "@nestjs/common";

export class CellIsNotANumberException extends BadRequestException {

    constructor(cell: string){
        super(`Célula ${cell} não é um número válido.`);
    }

}