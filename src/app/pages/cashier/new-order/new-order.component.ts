import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { Order } from '../../../domain/pos/Order';
import { OrderStatus } from '../../../domain/pos/OrderStatus';
import { MenuItemService } from '../../../services/menu-item.service'; 
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Inline MenuItem interface
interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
}

// OrderItem interface for simplicity
interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

@Component({
  selector: 'app-new-order',
  imports: [CommonModule],
  templateUrl: './new-order.component.html',
  styleUrl: './new-order.component.css'
})
export class NewOrderComponent implements OnInit {
  menuItems: MenuItem[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  orderItems: OrderItem[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.menuItems = [
      {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato and mozzarella',
        price: 8.99,
        category: 'Pizza',
        imageUrl: 'https://via.placeholder.com/150'
      },
      {
        id: 2,
        name: 'Cheeseburger',
        description: 'Juicy grilled beef patty with cheese',
        price: 6.49,
        category: 'Burger',
        imageUrl: 'https://via.placeholder.com/150'
      },
      {
        id: 3,
        name: 'Caesar Salad',
        description: 'Romaine lettuce with Caesar dressing',
        price: 5.99,
        category: 'Salad',
        imageUrl: 'https://via.placeholder.com/150'
      }
    ];
    this.extractCategories();
  }

  extractCategories(): void {
    const categorySet = new Set<string>();
    this.menuItems.forEach(item => categorySet.add(item.category));
    this.categories = ['All', ...Array.from(categorySet)];
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getFilteredItems(): MenuItem[] {
    if (this.selectedCategory === 'All') {
      return this.menuItems;
    }
    return this.menuItems.filter(item => item.category === this.selectedCategory);
  }

  addItemToOrder(item: MenuItem): void {
    const existingItem = this.orderItems.find(orderItem =>
      orderItem.menuItem.id === item.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.orderItems.push({
        menuItem: item,
        quantity: 1
      });
    }
  }

  removeItemFromOrder(index: number): void {
    this.orderItems.splice(index, 1);
  }

  updateQuantity(index: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItemFromOrder(index);
    } else {
      this.orderItems[index].quantity = quantity;
    }
  }

  calculateSubtotal(): number {
    return this.orderItems.reduce((sum, item) =>
      sum + (item.menuItem.price * item.quantity), 0);
  }

  calculateTax(): number {
    return this.calculateSubtotal() * 0.08;
  }

  calculateTotal(): number {
    return this.calculateSubtotal() + this.calculateTax();
  }

  clearOrder(): void {
    this.orderItems = [];
  }

  cancelOrder(): void {
    this.router.navigate(['/pos']);
  }
}
