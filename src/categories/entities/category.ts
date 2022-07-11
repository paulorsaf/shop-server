export class Category {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly createdBy: CategoryUser,
        public readonly companyId: string
    ) {}

}

export class SaveCategory {

    private createdAt: string;

    constructor(
        public readonly name: string,
        public readonly createdBy: CategoryUser,
        public readonly companyId: string
    ) {
        this.createdAt = new Date().toISOString();
    }

}

export class CategoryUser {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string
    ) {}

}