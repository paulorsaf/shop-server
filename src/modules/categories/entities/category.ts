export class Category {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly companyId: string,
        public readonly createdBy: string,
        public readonly createdAt: string,
        public readonly updatedAt: string
    ) {}

}