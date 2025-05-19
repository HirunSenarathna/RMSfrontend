import { OrderItem } from './OrderItem';
import { PaymentMethod } from './PaymentMethod';
import { OrderStatus } from './OrderStatus';

export interface Order {

  id?: number;
  customerId?: number; // Optional, as per backend OrderRequest
  customerName?: string;
  waiterId?: number;
  waiterName?: string;
  tableNumber?: number;
  orderStatus: OrderStatus; // Use string to match backend OrderStatus enum (e.g., 'PLACED', 'CONFIRMED')
  orderTime: string; // Use string to handle ISO date from backend
  updatedAt?: string;
  totalAmount: number; // Use number to match BigDecimal in frontend
  specialInstructions?: string;
  isPaid: boolean;
  paymentMethod?: PaymentMethod; // Use string to match enum (e.g., 'CASH', 'CARD')
  paymentStatus?: string; // Use string to match backend payment status
  transactionId?: string;
  paymentId?: number;
  paymentLink?: string;
  errorMessage?: string;
  isOnline: boolean;
  items: OrderItem[];

  // id?: number;
  // customerId: number;
  // customerName?: string;
  // waiterId?: number;
  // waiterName?: string;
  // tableNumber?: number;
  // status: OrderStatus; // rename to match backend `orderStatus`
  // createdAt: Date;     // map from backend `orderTime`
  // updatedAt?: Date;
  // total: number;
  // subtotal?: number;
  // tax?: number;
  // isPaid: boolean;
  // paymentMethod?: PaymentMethod;
  // paymentStatus?: string;
  // transactionId?: string;
  // paymentId?: number;
  // paymentLink?: string;
  // errorMessage?: string;
  // specialInstructions?: string;
  // isOnline: boolean;
  // items: OrderItem[];
  
    // id?: number;
    // orderNumber?: string;
    // items: OrderItem[];
    // subtotal: number;
    // tax: number;
    // total: number;
    // status: OrderStatus;
    // paymentMethod?: PaymentMethod;
    // isPaid: boolean;
    // isOnline: boolean;
    // createdAt: Date;
    // updatedAt?: Date; 
    // customerId?: number;
    // customerName?: string;
    // customerPhone?: string;
    // paymentLink?: string;
    // paymentStatus?: string;
    
  }