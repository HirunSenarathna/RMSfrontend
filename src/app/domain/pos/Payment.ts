import { PaymentMethod } from './PaymentMethod';

export interface Payment {
    id?: number;
    orderId: number;
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
    status: string;
    createdAt: Date;
  }