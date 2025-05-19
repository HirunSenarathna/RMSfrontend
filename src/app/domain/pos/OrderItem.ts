import { MenuItem } from "../menu-item";
export type ItemSize = 'SMALL' | 'MEDIUM' | 'LARGE';

export interface OrderItem {
    // id?: number;
    // menuItem: MenuItem;
    // quantity: number;
    // specialInstructions?: string;
    // price:number;

     id?: number;
  orderId?: number; // To correspond with the @ManyToOne order reference
  menuItemId: number;
  menuItemName: string;
  menuItemVariantId: number;
  variant?: string;
  size?: ItemSize;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  specialInstructions?: string;
  createdAt?: string;
  updatedAt?: string;
  }