import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
}


@Component({
  selector: 'app-menu-items',
  imports: [CommonModule],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.css'
})
export class MenuItemsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Salad',
      image: 'assets\salads1.jpg',
      price: 699,
      salePrice: 599
    },
    {
      id: 2,
      name: 'Orange juice',
      image: 'assets/drinks1.jpg',
      price: 1200
    },
    {
      id: 3,
      name: 'Rice & Curry',
      image: 'assets/rnc2.jpg',
      price: 199,
      salePrice: 149
    }
  ];

  addToCart(product: Product) {
    console.log(`Added to cart: ${product.name}`);
  }
}
