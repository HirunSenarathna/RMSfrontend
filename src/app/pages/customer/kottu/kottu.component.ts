import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuItemsComponent} from '../../../components/menu-items/menu-items.component';
import { MenuItem } from '../../../domain/menu-item';
import { MenuItemService } from '../../../services/menu-item.service';
import { CartService } from '../../../services/cart.service'; // Assuming you have a CartService
import { CartItem } from '../../../domain/cartItem'; // Assuming you have a CartItem interface


@Component({
  selector: 'app-kottu',
  imports: [CommonModule, MenuItemsComponent],
  templateUrl: './kottu.component.html',
  styleUrl: './kottu.component.css',
  
})
export class KottuComponent {
  menuItems: any[] = [];
  loading = true;
  error = '';
  cartItems: any[] = [];

  constructor(private menuItemService: MenuItemService,private cartService: CartService) {}

  ngOnInit(): void {
    
    this.menuItemService.getMenuItemsByCategory(1).subscribe({
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
    
    
    // stock reduction 
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
      // rating: 4, 
      sale: onSale,
      available: item.available,
      variants: item.variants
    };
  }
 
  

}
