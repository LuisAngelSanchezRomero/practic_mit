export interface Product {
    id?: number;
    name: string;
    price: number;
    stock: number;
    creationDate?: Date;
    description?: string;
    active?: boolean;
}