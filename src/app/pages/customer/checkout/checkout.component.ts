import { Component } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../services/cart.service';
import { CartItem } from '../../../domain/cartItem'; // Assuming you have a CartItem interface
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router for navigation
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import FormsModule and ReactiveFormsModule
import { AuthService } from '../../../services/auth.service'; // Import AuthService
import { PaymentService } from '../../../services/payment.service'; // Import PaymentService


@Component({
  selector: 'app-checkout',
  imports: [CommonModule,FormsModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartItems: CartItem[] = [];
  checkoutForm: FormGroup;
  selectedPaymentMethod: string = 'cod';
  orderPlaced: boolean = false;
  isUserLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService, // Inject AuthService
    private paymentService: PaymentService // Inject PaymentService
  ) {
    // Initialize checkout form with only the required fields
    this.checkoutForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      orderNotes: ['']
    });
  }

  ngOnInit(): void {
    // Subscribe to cart changes
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      
      // Redirect to home if cart is empty
      if (items.length === 0 && !this.orderPlaced) {
        this.router.navigate(['/']);
      }
    });
    
    // Check if user is logged in and auto-fill form
    this.checkUserLoginStatus();
  }

  /**
   * Check if user is logged in and auto-fill form with user data
   */
  checkUserLoginStatus(): void {
    this.authService.isAuthenticated().subscribe(isLoggedIn => {
      this.isUserLoggedIn = isLoggedIn;
      
      if (isLoggedIn) {
        this.authService.getCurrentUser().subscribe(user => {
          if (user) {
            // Auto-fill form with user data
            this.checkoutForm.patchValue({
              firstName: user.firstname || '',
              lastName: user.lastname || '',
              phone: user.phone || '',
              email: user.email || ''
            });
          }
        });
      }
    });
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }
  
  increaseQuantity(index: number): void {
    this.cartService.increaseQuantity(index);
  }
  
  decreaseQuantity(index: number): void {
    this.cartService.decreaseQuantity(index);
  }

  getSubtotal(): number {
    return this.cartService.getSubtotal();
  }
  
  getDiscount(): number {
    return this.cartService.getDiscount() * this.cartService.getSubtotal() ;
  }
  
  getTotal(): number {
    return this.cartService.getTotal();
  }

  placeOrder(): void {
    if (this.checkoutForm.valid) {
      // Get form and cart data
      const orderData = {
        customer: this.checkoutForm.value,
        items: this.cartItems,
        paymentMethod: this.selectedPaymentMethod,
        total: this.getTotal(),
        subtotal: this.getSubtotal(),
        shippingCost: this.getDiscount(),
        date: new Date(),
        userId: this.isUserLoggedIn ? this.authService.getCurrentUser: null
      };
      
      if (this.selectedPaymentMethod === 'cod') {
        // Handle Cash on Delivery
        this.processOrder(orderData);
      } else if (this.selectedPaymentMethod === 'gateway') {
        // Handle Payment Gateway
        this.processPaymentGateway(orderData);
      }
    } else {
      // Mark all form fields as touched to show validation errors
      this.markFormGroupTouched(this.checkoutForm);
      alert('Please fill in all required fields correctly before placing your order.');
    }
  }
  
  /**
   * Process the order for Cash on Delivery
   */
  processOrder(orderData: any): void {
    // In a real app, you would send this data to your backend
    console.log('Order placed:', orderData);
    
    // Show success message
    this.orderPlaced = true;
    
    // Clear cart
    this.cartService.clearCart();
    
    // Generate random order ID
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    
    // Show success message and redirect to confirmation page
    alert('Your order has been placed successfully!');
    this.router.navigate(['/orderConfirmation'], { 
      state: { 
        orderId: orderId,
        orderData: orderData
      } 
    });
  }
  
  /**
   * Process payment via payment gateway
   */
  processPaymentGateway(orderData: any): void {
    // First, create the order in pending status
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    orderData.orderId = orderId;
    orderData.status = 'pending_payment';
    
    // Initialize payment gateway
    this.paymentService.initializePayment(orderData).subscribe({
      next: (response) => {
        if (response && response.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = response.paymentUrl;
        } else {
          alert('Error initializing payment. Please try again.');
        }
      },
      error: (error) => {
        console.error('Payment initialization failed:', error);
        alert('Payment initialization failed. Please try again or choose a different payment method.');
      }
    });
  }
  
  submitOrder(): void {
    this.placeOrder();
  }
  
  // Helper method to mark all controls in a form group as touched
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
