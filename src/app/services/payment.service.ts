import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payment } from '../domain/payment'; // Adjust the import path as necessary
 // Adjust the import path as necessary
import { HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private apiUrl = 'http://localhost:8092/api/payments';

  constructor(private http: HttpClient, private authService: AuthService) { }

  initializePayment(orderData: any): Observable<Payment> {
    const headers = this.getAuthHeaders();
    const paymentRequest = {
      orderId: orderData.orderId,
      customerId: this.authService.getCurrentUserValue()?.id || null,
      amount: orderData.totalAmount,
      method: orderData.paymentMethod || 'CARD', // Match backend enum
      returnUrl: window.location.origin + '/orderConfirmation',
      isOnline: true,
    };

    return this.http.post<Payment>(`${this.apiUrl}/create`, paymentRequest, { headers }).pipe(
      tap((response) => console.log('Payment initialized:', response)),
      catchError((error) => {
        console.error('Error initializing payment:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to initialize payment.'));
      })
    );
  }

  // processCashPayment(orderId: number, paymentDetails: any): Observable<Payment> {
  //   const headers = this.getAuthHeaders();
  //   const paymentRequest = {
  //     orderId: orderId,
  //     customerId: this.authService.getCurrentUserValue()?.id || null,
  //     amount: paymentDetails.amount,
  //     method: paymentDetails.isOnline || false, // Match backend enum
  //     isOnline: false,
  //   };

  //   return this.http.post<Payment>(`${this.apiUrl}/process`, paymentRequest, { headers }).pipe(
  //     tap((response) => console.log('Cash payment processed:', response)),
  //     catchError((error) => {
  //       console.error('Error processing cash payment:', error);
  //       return throwError(() => new Error(error.error?.message || 'Failed to process cash payment.'));
  //     })
  //   );
  // }

    processCashPayment(orderId: number, paymentDetails: any): Observable<Payment> {
      console.log('Processing in-person payment for order:', orderId, paymentDetails);
      const headers = this.getAuthHeaders();
      const paymentRequest = {
        orderId: orderId,
        amount: paymentDetails.amount,
        method: paymentDetails.paymentMethod || 'CASH', 
        isOnline: false,
        processedBy: this.authService.getCurrentUserValue()?.id || null,
      };
  
      return this.http.post<Payment>(`${this.apiUrl}/${orderId}/process`, paymentRequest, { headers }).pipe(
        tap((response) => console.log('In-person payment processed:', response)),
        catchError((error) => {
          console.error('Error processing in-person payment:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to process payment.'));
        })
      );
    }

  processCardPayment(orderId: number, amount: number, cardDetails: any): Observable<Payment> {
    const headers = this.getAuthHeaders();
    const paymentRequest = {
      orderId: orderId,
      customerId: this.authService.getCurrentUserValue()?.id || null,
      amount: amount,
      method: 'CARD', // Match backend enum
      isOnline: false,
    };

    return this.http.post<Payment>(`${this.apiUrl}/process`, paymentRequest, { headers }).pipe(
      tap((response) => console.log('Card payment processed:', response)),
      catchError((error) => {
        console.error('Error processing card payment:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to process card payment.'));
      })
    );
  }

  processPaymentCallback(callbackData: any): Observable<Payment> {
    const headers = this.getAuthHeaders();
    return this.http.post<Payment>(`${this.apiUrl}/callback`, callbackData, { headers }).pipe(
      tap((response) => console.log('Payment callback processed:', response)),
      catchError((error) => {
        console.error('Error processing payment callback:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to process payment callback.'));
      })
    );
  }

  // initializePayment(orderData: any): Observable<any> {

  //   const headers = this.getAuthHeaders();
  //   const paymentRequest = {
  //     orderId: orderData.orderId,
  //     customerId: this.authService.getCurrentUserValue()?.id,
  //     amount: orderData.amount,
  //     method: 'CREDIT_CARD',
  //     returnUrl: window.location.origin + '/orderConfirmation',
  //     isOnline: true
  //   };
  //   return this.http.post(`${this.apiUrl}/create`, paymentRequest, { headers });
  // }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Initialize payment with the payment gateway
   * @param orderData Order data to process payment for
   * @returns Observable with payment gateway redirect URL
   */
  // initializePayment(orderData: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/initialize`, {
  //     orderId: orderData.orderId,
  //     amount: orderData.total,
  //     currency: 'LKR', // Currency code for Sri Lankan Rupee
  //     customerDetails: {
  //       firstName: orderData.customer.firstName,
  //       lastName: orderData.customer.lastName,
  //       email: orderData.customer.email,
  //       phone: orderData.customer.phone
  //     },
  //     items: orderData.items.map((item: any) => ({
  //       id: item.id,
  //       name: item.name,
  //       price: item.price,
  //       quantity: item.quantity
  //     })),
  //     metadata: {
  //       userId: orderData.userId
  //     },
  //     returnUrl: `${window.location.origin}/payment-callback`
  //   });
  // }

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
  // processPaymentCallback(callbackData: any): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/callback`, callbackData);
  // }


  //


  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPaymentsByOrderId(orderId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/order/${orderId}`);
  }

  createPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }

  processOnlineOrderPayment(orderId: number, paymentDetails: any): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/online/${orderId}`, paymentDetails);
  }

  // processCashPayment(orderId: number, amount: number): Observable<Payment> {
  //   return this.http.post<Payment>(`${this.apiUrl}/cash/${orderId}`, { amount });
  // }

  // processCardPayment(orderId: number, amount: number, cardDetails: any): Observable<Payment> {
  //   return this.http.post<Payment>(`${this.apiUrl}/card/${orderId}`, { amount, cardDetails });
  // }

//latest



  /**
   * Get a specific payment by ID
   */
  getPaymentById(id: string): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }



  /**
   * Process a refund
   */
  processRefund(paymentId: string): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/${paymentId}/refund`, {});
  }

  /**
   * Get payments filtered by criteria
   */
  getFilteredPayments(
    fromDate: Date | null,
    toDate: Date | null,
    paymentMethod: string | null,
    paymentStatus: string | null
  ): Observable<Payment[]> {
    let params = new HttpParams();
    
    if (fromDate) {
      params = params.set('fromDate', fromDate.toISOString());
    }
    
    if (toDate) {
      params = params.set('toDate', toDate.toISOString());
    }
    
    if (paymentMethod) {
      params = params.set('paymentMethod', paymentMethod);
    }
    
    if (paymentStatus) {
      params = params.set('paymentStatus', paymentStatus);
    }
    
    return this.http.get<Payment[]>(`${this.apiUrl}/filter`, { params });
  }


}
