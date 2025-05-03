export enum Size {
    SMALL = 'SMALL',
    MEDIUM = 'MEDIUM',
    LARGE = 'LARGE'
}

export interface MenuItemVariant {
    id: number | null;
    size: Size;
    variant: string;
    price: number;
    stockQuantity: number;
    available: boolean;
}