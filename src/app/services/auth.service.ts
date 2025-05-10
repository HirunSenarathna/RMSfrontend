import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject, catchError, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  username: string;
  role?: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  userId: number;
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: string;
  expiresIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 private apiUrl = 'http://localhost:8083/api';
  private tokenKey = 'auth_token';
  private userKey = 'user';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private http: HttpClient, private router: Router) {
    this.checkAuthStatus();
  }

  // Register a new customer
  register(user: any): Observable<any> {
    console.log('Registering user:', user);
    return this.http.post(`${this.apiUrl}/customers/register`, user);
  }

  // Login user (customer or employee)
  login(credentials: { identifier: string, password: string }): Observable<any> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          // Store token from response
          if (response.accessToken) {
            localStorage.setItem(this.tokenKey, response.accessToken);
          } else if (response.tokenType && response.tokenType === 'Bearer') {
            // For backwards compatibility - some responses might have token in different format
            localStorage.setItem(this.tokenKey, response.tokenType + ' ' + response.accessToken);
          }
          
          // Store user data
          localStorage.setItem(this.userKey, JSON.stringify(response));
          
          // Update observables
          this.currentUserSubject.next(response);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  // Logout user
  logout(): Observable<any> {
    // Get the token for the logout request
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Attempt to logout from the server
    return this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers })
      .pipe(
        tap(() => this.clearAuthData()),
        catchError(error => {
          console.error('Logout error:', error);
          // Still clear local auth data even if server logout fails
          this.clearAuthData();
          return of({ message: 'Logged out locally' });
        })
      );
  }

  // Clear all authentication data
  private clearAuthData(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  // Check if stored token exists and is valid
  private checkAuthStatus(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userJson = localStorage.getItem(this.userKey);
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (e) {
        this.clearAuthData();
      }
    }
  }

  // Get the stored authentication token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Check if user is authenticated
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Get current user information
  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Get current user value synchronously
  getCurrentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // Check if current user has a specific role
  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return !!user && user.role === role;
  }

 
}
