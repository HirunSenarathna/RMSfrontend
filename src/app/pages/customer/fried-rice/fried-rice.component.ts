import { Component } from '@angular/core';
import { MenuItemsComponent } from '../../../components/menu-items/menu-items.component';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../domain/menu-item';
import { MenuItemService } from '../../../services/menu-item.service';
import { CartService } from '../../../services/cart.service'; // Assuming you have a CartService
import { CartItem } from '../../../domain/cartItem'; // Assuming you have a CartItem interface

@Component({
  selector: 'app-fried-rice',
  imports: [CommonModule, MenuItemsComponent],
  templateUrl: './fried-rice.component.html',
  styleUrl: './fried-rice.component.css'
})
export class FriedRiceComponent {

   menuItems: any[] = [];
    loading = true;
    error = '';
    cartItems: any[] = [];
  
    constructor(private menuItemService: MenuItemService,private cartService: CartService) {}
  
    ngOnInit(): void {
      
      this.menuItemService.getMenuItemsByCategory(2).subscribe({
        next: (items: MenuItem[]) => {
          this.menuItems = items.map(item => this.transformMenuItem(item));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching kottu menu items:', err);
          this.error = 'Failed to load menu items. Please try again later.';
          this.loading = false;
        }
      });
    }
  
    // Transform API response to match the format expected by MenuItemsComponent
    onAddToCart(event: any) {
      const { item, variant } = event;
      
      const cartItem: CartItem = {
        id: item.id,
        name: item.name,
        variant: variant,
        price: variant.price,
        quantity: 1,
        image: item.image
      };
      
      this.cartService.addToCart(cartItem);
      
      // You would normally update the variant's stock quantity here via API call
      // Simulating stock reduction for now
      if (variant.stockQuantity > 0) {
        variant.stockQuantity--;
      }
    }
  
    private transformMenuItem(item: MenuItem): any {
      // Get the smallest priced variant for default display
      const smallestVariant = item.variants?.reduce((prev, current) => 
        (prev.price < current.price) ? prev : current
      );
      
      // Get the largest priced variant for comparison (if multiple variants exist)
      const largestVariant = item.variants?.reduce((prev, current) => 
        (prev.price > current.price) ? prev : current
      );
      
      // Check if item is on sale (if there are multiple price points)
      const onSale = item.variants && item.variants.length > 1 && 
                    smallestVariant.id !== largestVariant.id;
      
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        price: smallestVariant?.price || 0,
        oldPrice: onSale ? largestVariant?.price : null,
        image: item.imageUrl,
        rating: 4, // Default rating since API doesn't provide this
        sale: onSale,
        available: item.available,
        variants: item.variants
      };
    }
   
    

}
