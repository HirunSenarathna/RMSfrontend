import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-last-few-transactions',
  imports: [CommonModule],
  templateUrl: './last-few-transactions.component.html',
  styleUrl: './last-few-transactions.component.css'
})
export class LastFewTransactionsComponent {

  
  transactions = [
    {
      id: 1,
      title: "kottu",
      price: "Rs.600",
      status: "pending",
      imgSrc:"assets/kottu1.jpeg"
    },
    {
      id: 2,
      title: "Rice & Curry",
      price: "Rs.500",
      status: "Delivered",
      imgSrc:"assets/rnc1.jpg"

     
    },
    {
      id: 3,
      title: "Drinks",
      price: "Rs.150",
      status: "confirmed",
      imgSrc:"assets/drinks1.jpg"
      
     
    }
  ];
}
