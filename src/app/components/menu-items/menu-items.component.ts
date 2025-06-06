import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { MenuItemService } from '../../services/menu-item.service';

export interface Meal {
  name: string;
  price: number;
  discountedPrice?: number;
  imageUrl: string;
  onSale?: boolean;
}


@Component({
  selector: 'app-menu-items',
  imports: [CommonModule,MatFormFieldModule,MatSelectModule,MatSliderModule,FormsModule],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.css'
})
export class MenuItemsComponent {
 
  @Input() item: any;
  @Output() addToCart = new EventEmitter<any>();
  
  selectedVariant: any;

  constructor(private menuItemService: MenuItemService) {}

  ngOnInit(): void {
    // Set default selected variant to the first one
    const availableVariants = this.getAvailableVariants();
    if (availableVariants.length > 0) {
      this.selectedVariant = this.item.variants[0];
    }
  }

  
  // Get only variants that are in stock and available
  getAvailableVariants(): any[] {
    if (!this.item?.variants) {
      return [];
    }
    return this.item.variants.filter((variant: any) => variant.stockQuantity > 0 && variant.available);
  }

  rate(value: number) {
    this.item.rating = value;
    // You might want to implement a rating service later
  }
  
  onAddToCart() {
    // Emit event with item and selected variant
    this.addToCart.emit({
      item: this.item,
      variant: this.selectedVariant || this.item.variants?.[0]
    });
    alert('Item added to cart!');
  }
  
  onVariantChange(variantId: number) {
    if (this.item.variants) {
      this.selectedVariant = this.item.variants.find((v: any) => v.id === variantId);
    }
  }
  
}
