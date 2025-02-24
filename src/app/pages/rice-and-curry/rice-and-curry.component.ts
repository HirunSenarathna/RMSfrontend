import { Component } from '@angular/core';
import { MenuItemsComponent } from '../../components/menu-items/menu-items.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rice-and-curry',
  imports: [MenuItemsComponent,CommonModule],
  templateUrl: './rice-and-curry.component.html',
  styleUrl: './rice-and-curry.component.css'
})
export class RiceAndCurryComponent {

  menuItems = [
    {
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      image: 'assets/rnc1.jpg',
      rating: 4,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/rnc2.jpg',
      rating: 5,
    },
    {
      name: 'Vegetable Korma with Steamed Rice',
      oldPrice: 11.49,
      price: 8.62,
      image: 'assets/rnc3.jpeg',
      rating: 3,
      sale: true
    },
    {
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      image: 'assets/rnc4.jpeg',
      rating: 4,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/kottu5.jpeg',
      rating: 5,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/rnc5.jpeg',
      rating: 5,
    }
  ];

}
