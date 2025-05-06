import { OrderItem } from './OrderItem';
import { PaymentMethod } from './PaymentMethod';
import { OrderStatus } from './OrderStatus';

export interface Order {
    id?: number;
    orderNumber?: string;
    items: OrderItem[];
    subtotal: number;
    tax: number;
    total: number;
    status: OrderStatus;
    paymentMethod?: PaymentMethod;
    isPaid: boolean;
    isOnline: boolean;
    createdAt: Date;
    updatedAt?: Date;
    customerId?: number;
    customerName?: string;
    customerPhone?: string;
  }