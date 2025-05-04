import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8083/api/payments';

  constructor(private http: HttpClient) { }

  /**
   * Initialize payment with the payment gateway
   * @param orderData Order data to process payment for
   * @returns Observable with payment gateway redirect URL
   */
  initializePayment(orderData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/initialize`, {
      orderId: orderData.orderId,
      amount: orderData.total,
      currency: 'LKR', // Currency code for Sri Lankan Rupee
      customerDetails: {
        firstName: orderData.customer.firstName,
        lastName: orderData.customer.lastName,
        email: orderData.customer.email,
        phone: orderData.customer.phone
      },
      items: orderData.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      metadata: {
        userId: orderData.userId
      },
      returnUrl: `${window.location.origin}/payment-callback`
    });
  }

  /**
   * Verify payment status
   * @param paymentId Payment ID from the gateway
   * @returns Observable with payment verification result
   */
  verifyPayment(paymentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/verify/${paymentId}`);
  }

  /**
   * Handle payment callback from gateway
   * @param callbackData Data received from payment gateway callback
   * @returns Observable with payment processing result
   */
  processPaymentCallback(callbackData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/callback`, callbackData);
  }
}
