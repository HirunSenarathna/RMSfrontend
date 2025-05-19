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
  selectedPaymentMethod: string = 'CASH';
  orderPlaced: boolean = false;
  isUserLoggedIn: boolean = false;
  isSubmitting: boolean = false;

  constructor(
    private cartService: CartService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService, // Inject AuthService
    private paymentService: PaymentService, // Inject PaymentService
    private orderService: OrderService 

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
            this.checkoutForm.get('phone')?.disable();
            this.checkoutForm.get('email')?.disable();
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
    if (this.checkoutForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const orderData = {
        customer: this.checkoutForm.value,
        items: this.cartItems,
        paymentMethod: this.selectedPaymentMethod,
        amount: this.getTotal(),
        userId: this.isUserLoggedIn ? this.authService.getCurrentUserValue()?.id : null,
        tableNumber: null,
        isOnline: true,
        paymentStatus: 'PENDING',
        returnUrl: window.location.origin + '/orderConfirmation'
      };

      this.orderService.createOrder(orderData).subscribe({
        next: (response) => {
          console.log('Order created successfully:', response);
          this.orderPlaced = true;

          if (this.selectedPaymentMethod === 'CASH') {
            this.handleCashPayment(response);
          } else {
            this.handleCreditCardPayment(response);
          }
        },
        error: (error) => {
          console.error('Order creation failed:', error);
          alert('Failed to place order: ' + (error.message || 'Please try again'));
          this.isSubmitting = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.checkoutForm);
      alert('Please fill in all required fields correctly before placing your order.');
    }
  }

  private handleCashPayment(orderResponse: any): void {
    this.cartService.clearCart();
    alert('Your order has been placed successfully!');
    this.router.navigate(['/orderConfirmation'], {
      state: {
        orderId: orderResponse.orderId,
        orderData: orderResponse
      }
    });
    this.isSubmitting = false;
  }

  private handleCreditCardPayment(orderResponse: any): void {
  if (orderResponse.paymentLink) {
        console.log('Redirecting to payment link:', orderResponse.paymentLink);
        window.location.href = orderResponse.paymentLink;
    } else {
        console.log('No payment link, polling for order:', orderResponse.orderId);
        this.pollForPaymentLink(orderResponse.orderId);
    }
}

private pollForPaymentLink(orderId: number): void {
    const maxAttempts = 10;
    let attempts = 0;
    const interval = setInterval(() => {
        console.log(`Polling attempt ${attempts + 1} for order ${orderId}`);
        this.orderService.getOrderById(orderId).subscribe({
            next: (order) => {
                if (order.paymentLink ) {
                    clearInterval(interval);
                    console.log('Payment link received:', order.paymentLink);
                    window.location.href = order.paymentLink;
                } else if (order.paymentStatus === 'FAILED') {
                    clearInterval(interval);
                    console.error('Payment initiation failed');
                    alert('Payment setup failed. Please try again.');
                    this.isSubmitting = false;
                } else if (attempts >= maxAttempts) {
                    clearInterval(interval);
                    console.error('No payment link after max attempts');
                    alert('Error initializing payment. Please try again.');
                    this.isSubmitting = false;
                }
                attempts++;
            },
            error: (error) => {
                clearInterval(interval);
                console.error('Polling error:', error);
                alert('Error retrieving payment link.');
                this.isSubmitting = false;
            }
        });
    }, 2000); // Poll every 2 seconds
  }

  submitOrder(): void {
    this.placeOrder();
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // placeOrder(): void {
  //   if (this.checkoutForm.valid && !this.isSubmitting) {
  //     this.isSubmitting = true;
      
  //     const orderData = {
  //       customer: this.checkoutForm.value,
  //       items: this.cartItems,
  //       paymentMethod: this.selectedPaymentMethod,
  //       amount: this.getTotal(),
  //       userId: this.isUserLoggedIn ? this.authService.getCurrentUserValue()?.id : null,
  //       tableNumber: 1
  //     };

  //     this.orderService.createOrder(orderData).subscribe({
  //       next: (response) => {
  //         console.log('Order created successfully:', response);
  //         this.orderPlaced = true;
          
  //         if (this.selectedPaymentMethod === 'CASH') {
  //           this.handleCashPayment(response);
  //         } else {
  //           this.handleCreditCardPayment(response);
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Order creation failed:', error);
  //         alert('Failed to place order: ' + (error.message || 'Please try again'));
  //         this.isSubmitting = false;
  //       }
  //     });
  //   } else {
  //     this.markFormGroupTouched(this.checkoutForm);
  //     alert('Please fill in all required fields correctly before placing your order.');
  //   }
  // }

  // private handleCashPayment(orderResponse: any): void {
  //   this.cartService.clearCart();
  //   alert('Your order has been placed successfully!');
  //   this.router.navigate(['/orderConfirmation'], {
  //     state: {
  //       orderId: orderResponse.orderId,
  //       orderData: orderResponse
  //     }
  //   });
  //   this.isSubmitting = false;
  // }

  // private handleCreditCardPayment(orderResponse: any): void {
  //   console.log('Handling credit card payment:', orderResponse);
  //   if (orderResponse.paymentLink) {
  //     console.log('Redirecting to payment link:', orderResponse.paymentLink);
  //     // If the payment link is directly returned
  //     window.location.href = orderResponse.paymentLink;
  //   } else {
  //     // Otherwise, we need to initialize the payment separately
  //     const paymentData = {
  //       orderId: orderResponse.orderId,
  //       amount: orderResponse.totalAmount,
  //       returnUrl: window.location.origin + '/orderConfirmation'
  //     };
      
  //     this.paymentService.initializePayment(paymentData).subscribe({
  //       next: (paymentResponse) => {
  //         if (paymentResponse.paymentLink) {
  //           window.location.href = paymentResponse.paymentLink;
  //         } else {
  //           alert('Error initializing payment. Please try again.');
  //           this.isSubmitting = false;
  //         }
  //       },
  //       error: (error) => {
  //         console.error('Payment initialization failed:', error);
  //         alert('Payment initialization failed. Please try again or choose a different payment method.');
  //         this.isSubmitting = false;
  //       }
  //     });
  //   }
  // }

  // submitOrder(): void {
  //   this.placeOrder();
  // }

  // private markFormGroupTouched(formGroup: FormGroup) {
  //   Object.values(formGroup.controls).forEach(control => {
  //     control.markAsTouched();
  //     if (control instanceof FormGroup) {
  //       this.markFormGroupTouched(control);
  //     }
  //   });
  // }
}
