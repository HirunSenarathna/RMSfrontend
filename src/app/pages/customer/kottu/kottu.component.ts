import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItemsComponent} from '../../../components/menu-items/menu-items.component';

@Component({
  selector: 'app-kottu',
  imports: [CommonModule,MenuItemsComponent],
  templateUrl: './kottu.component.html',
  styleUrl: './kottu.component.css'
})
export class KottuComponent {
  menuItems = [
    {
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      image: 'assets/kottu1.jpeg',
      rating: 4,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/kottu2.jpeg',
      rating: 5,
    },
    {
      name: 'Vegetable Korma with Steamed Rice',
      oldPrice: 11.49,
      price: 8.62,
      image: 'assets/kottu3.jpeg',
      rating: 3,
      sale: true
    },
    {
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      image: 'assets/kottu4.jpeg',
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
      image: 'assets/kottu6.jpeg',
      rating: 5,
    },
   
    
    
  ];
  

}
