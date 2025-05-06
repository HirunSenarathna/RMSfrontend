import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HostListener } from '@angular/core';



interface Variant {
  size: string;
  price: number;
}

interface MenuItem {
  id: string;
  name: string;
  variants: Variant[];
}

interface OrderItem {
  id: string;
  name: string;
  variant: Variant;
  quantity: number;
}

@Component({
  selector: 'app-cashier-order-management',
  imports: [CommonModule],
  templateUrl: './cashier-order-management.component.html',
  styleUrl: './cashier-order-management.component.css',

})
export class CashierOrderManagementComponent implements OnInit {
  categories: string[] = ['Kottu', 'Fried Rice', 'Short Eats', 'Beverages'];
  activeCategory: string = 'Kottu';
  isDesktop: boolean = true;
  orderItems: OrderItem[] = [];
  
  // Menu items organized by category
  menuItems: Record<string, MenuItem[]> = {
    'Kottu': [
      { id: 'k1', name: 'Chicken Kottu', variants: [{ size: 'Small', price: 300 }, { size: 'Large', price: 500 }] },
      { id: 'k2', name: 'Cheese Kottu', variants: [{ size: 'Small', price: 350 }, { size: 'Large', price: 550 }] },
      { id: 'k3', name: 'Vegetable Kottu', variants: [{ size: 'Small', price: 250 }, { size: 'Large', price: 450 }] },
      { id: 'k4', name: 'Seafood Kottu', variants: [{ size: 'Small', price: 400 }, { size: 'Large', price: 600 }] }
    ],
    'Fried Rice': [
      { id: 'f1', name: 'Chicken Fried Rice', variants: [{ size: 'Small', price: 280 }, { size: 'Large', price: 450 }] },
      { id: 'f2', name: 'Egg Fried Rice', variants: [{ size: 'Small', price: 250 }, { size: 'Large', price: 400 }] },
      { id: 'f3', name: 'Mixed Fried Rice', variants: [{ size: 'Small', price: 320 }, { size: 'Large', price: 500 }] },
      { id: 'f4', name: 'Seafood Fried Rice', variants: [{ size: 'Small', price: 350 }, { size: 'Large', price: 550 }] }
    ],
    'Short Eats': [
      { id: 's1', name: 'Fish Roll', variants: [{ size: 'Regular', price: 120 }] },
      { id: 's2', name: 'Vegetable Patty', variants: [{ size: 'Regular', price: 100 }] },
      { id: 's3', name: 'Egg Bun', variants: [{ size: 'Regular', price: 150 }] },
      { id: 's4', name: 'Chicken Pastry', variants: [{ size: 'Regular', price: 180 }] },
      { id: 's5', name: 'Cutlet', variants: [{ size: 'Regular', price: 130 }] },
      { id: 's6', name: 'Vegetable Samosa', variants: [{ size: 'Regular', price: 110 }] }
    ],
    'Beverages': [
      { id: 'b1', name: 'Cola', variants: [{ size: 'Small', price: 120 }, { size: 'Large', price: 180 }] },
      { id: 'b2', name: 'Lemonade', variants: [{ size: 'Small', price: 150 }, { size: 'Large', price: 220 }] },
      { id: 'b3', name: 'Iced Tea', variants: [{ size: 'Small', price: 140 }, { size: 'Large', price: 200 }] },
      { id: 'b4', name: 'Water', variants: [{ size: 'Regular', price: 80 }] }
    ]
  };

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isDesktop = window.innerWidth >= 1024;
  }

  setActiveCategory(category: string) {
    this.activeCategory = category;
  }

  getItemsByCategory(category: string): MenuItem[] {
    return this.menuItems[category] || [];
  }

  addToOrder(item: MenuItem, variant: Variant) {
    const existingItemIndex = this.orderItems.findIndex(
      orderItem => orderItem.id === item.id && orderItem.variant.size === variant.size
    );

    if (existingItemIndex > -1) {
      this.increaseQuantity(existingItemIndex);
    } else {
      this.orderItems.push({
        id: item.id,
        name: item.name,
        variant: variant,
        quantity: 1
      });
    }
  }

  increaseQuantity(index: number) {
    if (index >= 0 && index < this.orderItems.length) {
      this.orderItems[index].quantity++;
    }
  }

  decreaseQuantity(index: number) {
    if (index >= 0 && index < this.orderItems.length) {
      if (this.orderItems[index].quantity > 1) {
        this.orderItems[index].quantity--;
      } else {
        this.orderItems.splice(index, 1);
      }
    }
  }

  calculateTotal(): number {
    return this.orderItems.reduce((sum, item) => {
      return sum + (item.quantity * item.variant.price);
    }, 0);
  }
}
