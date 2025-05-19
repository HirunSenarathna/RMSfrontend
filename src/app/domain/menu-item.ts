import { MenuItemVariant } from './menu-item-variant';
import { MenuCategory } from './menu-category';


// export interface MenuItem {
//     id: number | null;
//     name: string;
//     description?: string;
//     categoryId: number | null;
//     categoryName: string;
//     available: boolean;
//     imageUrl?: string;
//     imageFile?: File;
//     variants?: MenuItemVariant[];
// }

export interface MenuItem {
    id: number | 0;
    name: string;
    description: string;
    categoryId: number | null;
    categoryName: string;
    available: boolean;
    imageUrl?: string;
    imageBase64?: string;
    variants: MenuItemVariant[];
}

