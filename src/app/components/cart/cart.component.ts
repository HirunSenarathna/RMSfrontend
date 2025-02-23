import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [CommonModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
    cartItems = [
      {
        id: 1,
        name: 'Coconut Water',
        price: 2.99,
        quantity: 1,
        image: 'assets/drinks2.jpg' // Update with actual path
      },
      {
        id: 2,
        name: 'Fish Curry with Coconut Rice',
        price: 13.49,
        quantity: 1,
        image: 'assets/rnc2.jpg' // Update with actual path
      }
    ];
  
    shippingRate = 15.0;
  
    get subtotal(): number {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
  
    get total(): number {
      return this.subtotal + this.shippingRate;
    }
  
    increaseQuantity(item: any) {
      item.quantity++;
    }
  
    decreaseQuantity(item: any) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    }
  
    removeItem(index: number) {
      this.cartItems.splice(index, 1);
    }

    
  }
  
