import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

export interface Meal {
  name: string;
  price: number;
  discountedPrice?: number;
  imageUrl: string;
  onSale?: boolean;
}


@Component({
  selector: 'app-menu-items',
  imports: [CommonModule,MatFormFieldModule,MatSelectModule],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.css'
})
export class MenuItemsComponent {
 
  @Input() item: any;
}
