import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from '../domain/pos/Order';
import { CartItem } from '../domain/cartItem';
import { AuthService } from './auth.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:8091/api/orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  createOrder(orderData: any): Observable<any> {
    console.log('Original Order Data:', orderData);
    const headers = this.getAuthHeaders();
    
    // Transform cart items to match the backend expected format
    const orderItems = orderData.items.map((item: CartItem) => ({
      menuItemId: item.id,
      menuItemVariantId: item.variant?.id || item.variant?.id || 0,
      quantity: item.quantity,
      specialInstructions: item.specialInstructions || ''
    }));

    // Create order request object to match backend expectations
    const orderRequest = {
      customerId: orderData.userId || null,
      waiterId: orderData.waiterId || null,
      tableNumber: orderData.tableNumber || null,
      specialInstructions: orderData.customer?.orderNotes || '',
      paymentMethod: orderData.paymentMethod === 'CASH' ? 'CASH' : 'CREDIT_CARD',
      paymentStatus: orderData.paymentStatus || 'PENDING',
      returnUrl: window.location.origin + '/orderConfirmation',
      items: orderItems,
      online: orderData.isOnline || false,
    };

    console.log('Formatted Order Request:', orderRequest);
    
    return this.http.post<any>(`${this.apiUrl}`, orderRequest, { headers })
      .pipe(
        tap(response => console.log('Order creation successful:', response)),
        catchError(error => {
          console.error('Order creation error:', error);
          return throwError(() => new Error(error.error?.message || 'Failed to create order. Please try again.'));
        })
      );
  }

  getOrderById(id: number): Observable<Order> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order>(`${this.apiUrl}/${id}`, { headers }).pipe(
      catchError(error => {
        console.error(`Error fetching order ${id}:`, error);
        return throwError(() => new Error('Failed to fetch order details'));
      })
    );
  }

  getActiveOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}/active`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching active orders:', error);
        return throwError(() => new Error('Failed to fetch active orders'));
      })
    );
  }
  

 getPendingOnlineOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}/unpaid?online=true`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching pending online orders:', error);
        return throwError(() => new Error('Failed to fetch pending online orders'));
      })
    );
  }

  processInPersonPayment(orderId: number, paymentDetails: any): Observable<Order> {
    console.log('Processing in-person payment for order:', orderId, paymentDetails);
    const headers = this.getAuthHeaders();
    const paymentRequest = {
      orderId: orderId,
      
      amount: paymentDetails.amount,
      method: paymentDetails.paymentMethod || 'CASH', 
      isOnline: false,
      processedBy: this.authService.getCurrentUserValue()?.id || null,
    };

    return this.http.post<Order>(`${this.apiUrl}/${orderId}/pay/in-person`, paymentRequest, { headers }).pipe(
      tap((response) => console.log('In-person payment processed:', response)),
      catchError((error) => {
        console.error('Error processing in-person payment:', error);
        return throwError(() => new Error(error.error?.message || 'Failed to process payment.'));
      })
    );
  }

  getOrderHistory(filters: any): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}/history`, { headers, params: filters }).pipe(
      catchError(error => {
        console.error('Error fetching order history:', error);
        return throwError(() => new Error('Failed to fetch order history'));
      })
    );
  }

  getAllOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching all orders:', error);
        return throwError(() => new Error('Failed to fetch orders'));
      })
    );
  }

  getOnlineUnpaidOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}/online/unpaid`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching pending orders:', error);
        return throwError(() => new Error('Failed to fetch pending orders'));
      })
    );
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    const headers = this.getAuthHeaders();
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status }, { headers }).pipe(
      catchError(error => {
        console.error(`Error updating order ${id} status:`, error);
        return throwError(() => new Error('Failed to update order status'));
      })
    );
  }

  getOnlineOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}/online`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching online orders:', error);
        return throwError(() => new Error('Failed to fetch online orders'));
      })
    );
  }

  getInRestaurantOrders(): Observable<Order[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}/in-restaurant`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching in-restaurant orders:', error);
        return throwError(() => new Error('Failed to fetch in-restaurant orders'));
      })
    );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
