import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {

  constructor(public orderService: OrderService) {}

  removeItem(index: number) {
    this.orderService.removeFromCart(index);
  }

  placeOrder() {
    alert('Order placed successfully!');
  }

}
