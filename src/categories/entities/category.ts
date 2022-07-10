export class Category {

    constructor(
        public readonly id: string,
        public readonly name: string
    ) {}

}

export class CategoryUser {

    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string
    ) {}

}