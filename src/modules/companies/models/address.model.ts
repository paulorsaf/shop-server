export type Address = {
    readonly street: string;
    readonly number?: string;
    readonly complement: string;
    readonly neighborhood: string;
    readonly zipCode: string;
    readonly city: string;
    readonly state: string;
    readonly latitude?: number;
    readonly longitude?: number;
}