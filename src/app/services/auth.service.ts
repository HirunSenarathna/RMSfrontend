import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/customer'; 
  private apiUrl2 = 'http://localhost:8000/auth'; 

  constructor(private http: HttpClient) {}

  register(user: any): Observable<any> {

    return this.http.post(`${this.apiUrl}/save`, user);
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl2}/login`, credentials);
  }
}
