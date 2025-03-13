import { Component } from '@angular/core';
import { MenuItemsComponent } from '../../../components/menu-items/menu-items.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drinks',
  imports: [MenuItemsComponent,CommonModule],
  templateUrl: './drinks.component.html',
  styleUrl: './drinks.component.css'
})
export class DrinksComponent {

  menuItems = [
    {
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      image: 'assets/drinks1.jpg',
      rating: 4,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/drinks2.jpg',
      rating: 5,
    },
    {
      name: 'Vegetable Korma with Steamed Rice',
      oldPrice: 11.49,
      price: 8.62,
      image: 'assets/drinks3.jpeg',
      rating: 3,
      sale: true
    },
    {
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      image: 'assets/drinks4.jpeg',
      rating: 4,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/drinks5.jpeg',
      rating: 5,
    },
    {
      name: 'Vegetable Korma with Steamed Rice',
      oldPrice: 11.49,
      price: 8.62,
      image: 'assets/drinks3.jpeg',
      rating: 3,
      sale: true
    },
  ];
}
