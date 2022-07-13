export class DeleteProductCommand {

    constructor(
        public readonly id: string,
        public readonly userId: string,
        public readonly companyId: string
    ){}

}