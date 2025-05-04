import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject, catchError, of } from 'rxjs';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8083/api/customers'; 
  private apiUrl1 = 'http://localhost:8083/api/auth';


  constructor(private http: HttpClient) {
    // Check if user is logged in on service instantiation
    this.checkAuthStatus();
  }

  register(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    
    return this.http.post(`${this.apiUrl}/register`, user, { 
      headers,
      withCredentials: true // Include if using cookies/sessions
    });
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl1}/login`, credentials);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl1}/logout`, {}, {
      withCredentials: true // Ensure cookies/session are handled
    });
  }


  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  

  /**
   * Check authentication status from local storage token
   */
  private checkAuthStatus(): void {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      // Verify token with backend
      this.verifyToken(token).subscribe({
        next: (user) => {
          if (user) {
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          } else {
            // Clear invalid token
            this.logout();
          }
        },
        error: () => {
          // Token verification failed, clear it
          this.logout();
        }
      });
    }
  }

  /**
   * Verify token with backend
   * @param token JWT token to verify
   * @returns Observable with user data if token is valid
   */
  private verifyToken(token: string): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      catchError(() => of(null))
    );
  }

  /**
   * Login user
   * @param email User email
   * @param password User password
   * @returns Observable with login result
   */
  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
  //     .pipe(
  //       tap(response => {
  //         if (response.token) {
  //           localStorage.setItem('auth_token', response.token);
  //           this.currentUserSubject.next(response.user);
  //           this.isAuthenticatedSubject.next(true);
  //         }
  //       })
  //     );
  // }

  /**
   * Logout user
   */
  // logout(): void {
  //   localStorage.removeItem('auth_token');
  //   this.currentUserSubject.next(null);
  //   this.isAuthenticatedSubject.next(false);
  // }

  /**
   * Check if user is authenticated
   * @returns Observable with authentication status
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  /**
   * Get current user data
   * @returns Observable with current user data
   */
  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  /**
   * Get current user ID
   * @returns Current user ID or null if not logged in
   */
  getCurrentUserId(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser ? currentUser.id : null;
  }

 
}
