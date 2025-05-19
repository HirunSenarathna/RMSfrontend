export interface Payment {
    id: number;
    order_id: number;
    amount: number;
    payment_method: 'CASH' | 'CARD' | 'ONLINE';
    payment_status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
    transaction_id?: string;
    created_at: Date;
    cashier_id?: number;
    paymentlink?: string;

  }