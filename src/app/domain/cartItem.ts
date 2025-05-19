export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    specialInstructions?: string;
    variant?: {
      id: number;
      name: string;
      price: number;
      stockQuantity: number;
    };
  }