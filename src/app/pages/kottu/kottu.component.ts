import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItemsComponent} from '../../components/menu-items/menu-items.component';

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
      image: 'assets/image1.jpg',
      rating: 4,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/image2.jpg',
      rating: 5,
    },
    {
      name: 'Vegetable Korma with Steamed Rice',
      oldPrice: 11.49,
      price: 8.62,
      image: 'assets/image3.jpg',
      rating: 3,
      sale: true
    },
    {
      name: 'Fish Curry with Coconut Rice',
      price: 13.49,
      image: 'assets/image1.jpg',
      rating: 4,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/image2.jpg',
      rating: 5,
    },
    {
      name: 'Lamb Rogan Josh with Basmati Rice',
      price: 14.99,
      image: 'assets/image2.jpg',
      rating: 5,
    },
   
    
    
  ];
  

}
