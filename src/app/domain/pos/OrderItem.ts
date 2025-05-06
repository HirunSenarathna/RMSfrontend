import { MenuItem } from "../menu-item";

export interface OrderItem {
    menuItem: MenuItem;
    quantity: number;
    specialInstructions?: string;
    price:number;
  }