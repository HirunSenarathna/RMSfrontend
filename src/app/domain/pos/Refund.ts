export interface Refund {
    id?: number;
    paymentId: number;
    amount: number;
    reason: string;
    createdAt: Date;
  }