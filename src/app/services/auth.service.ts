import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8083/api/customers'; 
  private apiUrl1 = 'http://localhost:8083/api/auth';


  constructor(private http: HttpClient) {}

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
}
