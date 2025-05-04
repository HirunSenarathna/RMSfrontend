import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { PaymentService } from '../../services/payment.service';
import { CartService } from '../../services/cart.service'; // Assuming you have a CartService

import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-payment-callback',
  imports: [CommonModule],
  templateUrl: './payment-callback.component.html',
  styleUrl: './payment-callback.component.css'
})
export class PaymentCallbackComponent implements OnInit {
  loading: boolean = true;
  paymentStatus: 'success' | 'error' | null = null;
  orderId: string = '';
  errorMessage: string = 'Something went wrong with your payment. Please try again.';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    // Get query parameters from URL
    this.route.queryParams.subscribe(params => {
      const paymentId = params['payment_id'];
      const status = params['status'];
      
      if (paymentId) {
        // Verify payment status with backend
        this.verifyPayment(paymentId);
      } else if (status === 'cancelled') {
        // Payment was cancelled by user
        this.loading = false;
        this.paymentStatus = 'error';
        this.errorMessage = 'Payment was cancelled. Please try again or choose a different payment method.';
      } else {
        // Invalid callback - no payment ID
        this.loading = false;
        this.paymentStatus = 'error';
        this.errorMessage = 'Invalid payment response. Please contact support if you believe this is an error.';
      }
    });
  }

  /**
   * Verify payment status with backend
   */
  verifyPayment(paymentId: string): void {
    this.paymentService.verifyPayment(paymentId).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.status === 'success') {
          // Payment successful
          this.paymentStatus = 'success';
          this.orderId = response.orderId;
          
          // Clear cart after successful payment
          this.cartService.clearCart();
        } else {
          // Payment failed
          this.paymentStatus = 'error';
          this.errorMessage = response.message || this.errorMessage;
        }
      },
      error: (error) => {
        this.loading = false;
        this.paymentStatus = 'error';
        this.errorMessage = 'Failed to verify payment. Please contact support with reference: ' + paymentId;
        console.error('Payment verification error:', error);
      }
    });
  }

  /**
   * Navigate to order details page
   */
  navigateToOrderDetails(): void {
    this.router.navigate(['/order-confirmation'], { 
      state: { orderId: this.orderId } 
    });
  }

  /**
   * Navigate back to checkout
   */
  navigateToCheckout(): void {
    this.router.navigate(['/checkout']);
  }

  /**
   * Navigate to home page
   */
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

}
