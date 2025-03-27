export interface Order {
  orderId?: string;
  totalAmount?: number;
  orderDate?: string;
  orderTime?: string;
  pickupDate?: string;
  pickupTime?: string;
  customer?: string;
  paymentMethod?: string;
  itemName?: string;
  quantity?: number;
  unitPrice?: number;
  total?: number;
  server?: string;
  orderType?: string;
  status?: string;
}
