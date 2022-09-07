import { NotFoundException } from "@nestjs/common";

export class ZipCodeNotFoundException extends NotFoundException {
    constructor() {
        super("CEP não encontrado");
        this.name = "zip-code-not-found";
    }
}